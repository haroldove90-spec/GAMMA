import { supabase } from '../lib/supabase';
import type { ReceptionFormValues } from '../features/reception/receptionSchema';

export async function createReceptionOrder(data: ReceptionFormValues) {
  try {
    // 1. Upsert Cliente (buscando por teléfono)
    const { data: clientData, error: clientError } = await (supabase
      .from('clientes') as any)
      .upsert({
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email || null,
        direccion: data.direccion || null,
      }, { onConflict: 'telefono' })
      .select('id')
      .single();

    if (clientError) throw clientError;
    if (!clientData) throw new Error('No se pudo procesar la información del cliente');
    const clienteId = clientData.id;

    // 2. Crear Equipo
    const { data: equipoData, error: equipoError } = await (supabase
      .from('equipos') as any)
      .insert({
        cliente_id: clienteId,
        tipo: data.tipo,
        marca: data.marca,
        modelo: data.modelo || null,
        serie: data.serie || null,
        estado_fisico: data.estadoFisico || null,
      })
      .select('id')
      .single();

    if (equipoError) throw equipoError;
    if (!equipoData) throw new Error('No se pudo procesar la información del equipo');
    const equipoId = equipoData.id;

    // 3. Crear Orden de Servicio
    const { data: ordenData, error: ordenError } = await (supabase
      .from('ordenes_servicio') as any)
      .insert({
        equipo_id: equipoId,
        falla_reportada: data.fallaReportada,
        costo_estimado: data.costoEstimado,
        anticipo: data.anticipo,
        metodo_pago: data.metodoPago,
        estatus: 'Pendiente',
        fecha_promesa: data.fechaPromesa?.toISOString() || null,
      })
      .select('id, folio')
      .single();

    if (ordenError) throw ordenError;
    if (!ordenData) throw new Error('No se pudo generar la orden de servicio');

    return { success: true, ordenId: (ordenData as any).id, folio: (ordenData as any).folio };
  } catch (error: any) {
    console.error('Error en recepción:', error);
    return { success: false, error: error.message };
  }
}
