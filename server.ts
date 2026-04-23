import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Inyectar variables de entorno al cliente de forma segura si es necesario
  console.log('Configurando cliente con URL:', process.env.VITE_SUPABASE_URL ? 'OK (definida)' : 'ERROR (undefined)');
  
  app.get("/config.js", (req, res) => {
    res.type("application/javascript");
    res.send(`
      window.VITE_SUPABASE_URL = "${process.env.VITE_SUPABASE_URL || ''}";
      window.VITE_SUPABASE_ANON_KEY = "${process.env.VITE_SUPABASE_ANON_KEY || ''}";
    `);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
