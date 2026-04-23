import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type OrderStatus = Database['public']['Tables']['ordenes_servicio']['Row']['estatus'];

export async function getWorkshopOrders() {
  const { data, error } = await supabase
    .from('ordenes_servicio')
    .select(`
      *,
      equipo:equipos(
        *,
        cliente:clientes(*)
      )
    `)
    .order('fecha_entrada', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateOrderDiagnostics(
  orderId: string, 
  update: {
    estatus: OrderStatus;
    diagnostico_tecnico?: string;
    costo_final?: number;
  }
) {
  const { data, error } = await supabase
    .from('ordenes_servicio')
    .update({
      estatus: update.estatus,
      diagnostico_tecnico: update.diagnostico_tecnico,
      costo_estimado: update.costo_final, // En este flujo simplificado usamos costo_estimado como final
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addPartToOrder(orderId: string, partId: string, quantity: number, price: number) {
  const { data, error } = await supabase
    .from('orden_refacciones')
    .insert({
      orden_id: orderId,
      refaccion_id: partId,
      cantidad: quantity,
      precio_aplicado: price,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
