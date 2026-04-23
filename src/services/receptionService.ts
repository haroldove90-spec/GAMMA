import { supabase, isConfigured } from '../lib/supabase';
import type { ReceptionFormValues } from '../features/reception/receptionSchema';

export async function createReceptionOrder(data: ReceptionFormValues) {
  if (!isConfigured) {
    return { 
      success: false, 
      error: 'La base de datos no está configurada. Por favor, agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en los ajustes del proyecto.' 
    };
  }

  try {
    // 1. Upsert Cliente (buscando por teléfono)
    console.log('Intentando upsert de cliente:', { nombre: data.nombre, telefono: data.telefono });
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

    if (clientError) {
      console.error('Error en upsert cliente:', clientError);
      throw clientError;
    }
    if (!clientData) throw new Error('El cliente no devolvió datos tras el registro');
    const clienteId = clientData.id;

    // 2. Crear Equipo
    console.log('Insertando equipo para cliente:', clienteId);
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

    if (equipoError) {
      console.error('Error en insert equipo:', equipoError);
      throw equipoError;
    }
    if (!equipoData) throw new Error('El equipo no devolvió datos tras el registro');
    const equipoId = equipoData.id;

    // 3. Crear Orden de Servicio
    console.log('Creando orden de servicio para equipo:', equipoId);
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

    if (ordenError) {
      console.error('Error en insert orden:', ordenError);
      throw ordenError;
    }
    if (!ordenData) throw new Error('La orden no devolvió datos tras el registro');

    const resultData = ordenData as any;
    return { success: true, ordenId: resultData.id, folio: resultData.folio };
  } catch (error: any) {
    console.error('Error detallado en recepción:', error);
    
    // Capturar errores comunes de Supabase para guiar al usuario
    let userFriendlyError = `${error.message || 'Error desconocido'} (${error.code || 'no-code'})`;
    
    if (error.code === '42P01') {
      userFriendlyError = 'La tabla no existe. Asegúrate de haber ejecutado el SQL en Supabase.';
    } else if (error.code === '23505') {
      userFriendlyError = 'Ya existe un registro con ese dato único (ej: el folio o teléfono ya existe).';
    } else if (error.message?.includes('failed to fetch')) {
      userFriendlyError = 'No hay conexión con el servidor. Verifica las llaves VITE_SUPABASE_URL y ANON_KEY.';
    }

    return { success: false, error: userFriendlyError };
  }
}
