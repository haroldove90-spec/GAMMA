import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// En Vite, para que las variables se expongan al cliente deben empezar con VITE_
// Usamos una combinación de variables de entorno y variables inyectadas por el servidor (window)
let supabaseUrl = (window as any).VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = (window as any).VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Limpiar la URL de posibles terminaciones incorrectas que causan PGRST125
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.trim().replace(/\/+$/, '');
  if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1', '');
  }
}

console.log('--- SUPABASE DIAGNOSTIC ---');
console.log('Final URL being used:', supabaseUrl);
console.log('Has Key:', !!supabaseAnonKey);
console.log('---------------------------');

export const isConfigured = !!supabaseUrl && !!supabaseAnonKey && (supabaseUrl.length > 10 && !supabaseUrl.includes('placeholder'));

if (!isConfigured) {
  console.warn(
    'ADVERTENCIA: Credenciales de Supabase no configuradas. ' +
    'Ve a Settings > Secrets y agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// Mantenemos esta exportación para compatibilidad si se llega a migrar a Next.js
export const getSupabaseServer = () => supabase;
