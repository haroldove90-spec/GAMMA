import * as React from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] bg-[#002D4C] border border-white/10 rounded-2xl shadow-2xl p-6 z-[100] overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setShowPrompt(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-5 mr-8">
            <div className="bg-white p-2 rounded-xl shrink-0">
              <img 
                src="https://cossma.com.mx/gama.png" 
                alt="Gama Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h3 className="text-white font-black uppercase text-sm tracking-widest">App Gama</h3>
              <p className="text-white/60 text-[10px] uppercase font-bold tracking-tight mt-1">
                Instala nuestra aplicación para una mejor experiencia offline y acceso rápido.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button 
              onClick={handleInstallClick}
              className="w-full bg-[#FF4F00] hover:bg-[#e64700] text-white font-black uppercase text-xs tracking-[0.2em] h-12 shadow-lg shadow-[#FF4F00]/20"
            >
              <Download className="w-4 h-4 mr-2" />
              ¡Instalar App Gama ahora!
            </Button>
            <p className="text-center text-[9px] text-white/30 uppercase font-bold">
              Disponible para Android, iOS y Escritorio
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
