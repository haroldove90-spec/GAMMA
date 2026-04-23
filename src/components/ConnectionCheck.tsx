import * as React from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Database as DbIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ConnectionCheck() {
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function testConnection() {
      try {
        // Intento de fetch a la tabla 'equipos'
        const { error } = await supabase
          .from('equipos')
          .select('id')
          .limit(1);

        if (error) throw error;
        
        setStatus('success');
      } catch (err: any) {
        console.error('Database connection error:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Error desconocido al conectar');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full transition-all hover:bg-white/10">
      <DbIcon className="w-4 h-4 text-white/50" />
      
      {status === 'loading' && (
        <div className="flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Conectando...</span>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-green-500">Conexión Exitosa con GAMA DB</span>
          <Badge variant="outline" className="text-[8px] bg-green-500/10 text-green-500 border-green-500/20">LIVE</Badge>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2">
          <XCircle className="w-3 h-3 text-red-500" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">Error de Conexión</span>
          <span className="text-[8px] opacity-60 font-mono hidden md:inline text-red-400">Verifica Credenciales VITE_ o ejecuta el SQL</span>
        </div>
      )}
    </div>
  );
}
