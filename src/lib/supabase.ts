import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// En Vite, para que las variables se expongan al cliente deben empezar con VITE_
// Usamos una combinación de variables de entorno y variables inyectadas por el servidor (window)
const supabaseUrl = (window as any).VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = (window as any).VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('--- SUPABASE DIAGNOSTIC ---');
console.log('Window URL:', (window as any).VITE_SUPABASE_URL);
console.log('Import Meta URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Final URL being used:', supabaseUrl);
console.log('Has Key:', !!supabaseAnonKey);
console.log('---------------------------');

export const isConfigured = !!supabaseUrl && !!supabaseAnonKey && (supabaseUrl.length > 5 && !supabaseUrl.includes('placeholder'));

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
