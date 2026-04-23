import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Detectar variables según el framework (Vite o Next.js)
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: Las credenciales de Supabase no están configuradas en .env.local'
  );
}

// Cliente estándar para uso en el Browser (Cliente)
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

/**
 * Estructura para Server Components (Next.js 14+)
 * En un entorno Next.js real, aquí usarías 'createServerComponentClient' 
 * de @supabase/auth-helpers-nextjs o @supabase/ssr
 */
export const getSupabaseServer = () => {
  // Nota: Esta es una implementación simplificada para este entorno
  return createClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || ''
  );
};
