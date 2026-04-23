import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: No se encontraron las credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- Iniciando Limpieza de Datos ---');
  
  // Limpieza en orden inverso por Foreign Keys
  await supabase.from('orden_refacciones').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ordenes_servicio').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('equipos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('clientes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('refacciones').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('--- Insertando Clientes ---');
  const { data: clientes, error: errC } = await supabase.from('clientes').insert([
    { nombre: 'Ricardo Mendez', telefono: '5512345678', email: 'ricardo.m@email.com', direccion: 'Col. Roma Norte, CDMX' },
    { nombre: 'Elena Guerrero', telefono: '5587654321', email: 'elena.g@empresa.mx', direccion: 'Polanco V Seccion, CDMX' },
    { nombre: 'Audio Design S.A.', telefono: '5555555555', email: 'contacto@audiodesign.mx', direccion: 'Naucalpan, EdoMex' },
    { nombre: 'Julian Ortega', telefono: '5522334455', email: 'j.ortega@gmail.com', direccion: 'Coyoacán, CDMX' },
    { nombre: 'Maria Casas', telefono: '5544332211', email: 'm.casas@prodigy.net.mx', direccion: 'Santa Fe, CDMX' }
  ]).select();

  if (errC) console.error(errC);

  console.log('--- Insertando Equipos ---');
  const c = clientes!;
  const { data: equipos, error: errE } = await supabase.from('equipos').insert([
    { cliente_id: c[0].id, tipo: 'Video', marca: 'Samsung', modelo: 'Smart TV 55 QLED', serie: 'SAM-9921-X', estado_fisico: 'Excelente estado, sin rayones' },
    { cliente_id: c[0].id, tipo: 'Computación', marca: 'Dell', modelo: 'Latitude 5420', serie: 'DELL-SKU-92', estado_fisico: 'Desgaste normal en teclado' },
    { cliente_id: c[1].id, tipo: 'Computación', marca: 'Apple', modelo: 'MacBook Pro 14 M2', serie: 'APL-M2-2023', estado_fisico: 'Golpe leve en esquina superior derecha' },
    { cliente_id: c[2].id, tipo: 'Audio', marca: 'Marantz', modelo: 'SR6015 Receiver', serie: 'MZ-88210', estado_fisico: 'Polvoso, falta perilla de volumen' },
    { cliente_id: c[2].id, tipo: 'Audio', marca: 'Yamaha', modelo: 'Stagepas 600BT', serie: 'YM-BT-001', estado_fisico: 'Uso rudo profesional' },
    { cliente_id: c[3].id, tipo: 'Video', marca: 'Sony', modelo: 'PS5 Digital', serie: 'PS5-DG-921', estado_fisico: 'Sello de garantía roto' },
    { cliente_id: c[4].id, tipo: 'Línea Blanca', marca: 'LG', modelo: 'InstaView Door-in-Door', serie: 'LG-REF-22', estado_fisico: 'Impecable' },
    { cliente_id: c[4].id, tipo: 'Línea Blanca', marca: 'Whirlpool', modelo: 'Xpert System 20kg', serie: 'WH-LAV-XP', estado_fisico: 'Fuga de agua visible' }
  ]).select();

  if (errE) console.error(errE);

  console.log('--- Insertando Órdenes de Servicio ---');
  const e = equipos!;
  const hoy = new Date();
  const fechaPromesa = new Date();
  fechaPromesa.setDate(hoy.getDate() + 5);

  await supabase.from('ordenes_servicio').insert([
    { equipo_id: e[0].id, falla_reportada: 'Rayas verticales en la pantalla', costo_estimado: 2500, anticipo: 500, estatus: 'En Diagnóstico', fecha_entrada: hoy.toISOString() },
    { equipo_id: e[1].id, falla_reportada: 'No carga batería', costo_estimado: 1200, anticipo: 0, estatus: 'Pendiente', fecha_entrada: hoy.toISOString() },
    { equipo_id: e[2].id, falla_reportada: 'Derrame de café en teclado', costo_estimado: 4500, anticipo: 2000, estatus: 'Esperando Refacción', fecha_entrada: hoy.toISOString() },
    { equipo_id: e[3].id, falla_reportada: 'No enciende, pantalla frontal muerta', costo_estimado: 1800, anticipo: 200, estatus: 'Listo para Entrega', fecha_entrada: hoy.toISOString() },
    { equipo_id: e[5].id, falla_reportada: 'Sobrecalentamiento y apagado', costo_estimado: 850, anticipo: 0, estatus: 'Pendiente', fecha_entrada: hoy.toISOString() },
    { equipo_id: e[7].id, falla_reportada: 'No centrifuga, hace ruido fuerte', costo_estimado: 3200, anticipo: 1000, estatus: 'En Diagnóstico', fecha_entrada: hoy.toISOString() }
  ]);

  console.log('--- Insertando Refacciones ---');
  await supabase.from('refacciones').insert([
    { nombre: 'Capacitor 4700uF 50V', stock: 50, precio_costo: 35 },
    { nombre: 'Pasta Térmica MX-4 4g', stock: 12, precio_costo: 180 },
    { nombre: 'Módulo WiFi Dell 5420', stock: 3, precio_costo: 450 },
    { nombre: 'Bomba de Agua Whirlpool 20kg', stock: 5, precio_costo: 850 },
    { nombre: 'Panel LED 55 Samsung QLED', stock: 2, precio_costo: 6800 },
    { nombre: 'Fuente Poder PS5 Original', stock: 4, precio_costo: 1200 },
    { nombre: 'Kit Limpieza Profunda', stock: 25, precio_costo: 85 },
    { nombre: 'Transistor de Potencia Audio', stock: 100, precio_costo: 12 },
    { nombre: 'Teclado MacBook Pro A2442', stock: 1, precio_costo: 2100 },
    { nombre: 'Sensor de Humedad LG', stock: 8, precio_costo: 320 }
  ]);

  console.log('--- SEED COMPLETADO EXITOSAMENTE ---');
}

seed();
