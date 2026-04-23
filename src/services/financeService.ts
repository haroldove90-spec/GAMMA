import { supabase } from '../lib/supabase';

export async function getFinancialSummary() {
  // En una implementación real, esto usaría funciones agregadas de Supabase (rpc)
  // Aquí simulamos la lógica para la demo con consultas eficientes
  
  const { data: orders, error: ordersError } = await supabase
    .from('ordenes_servicio')
    .select(`
      id,
      costo_final,
      anticipo,
      estatus,
      metodo_pago,
      fecha_entrada,
      equipo:equipos(tipo),
      refacciones_usadas:orden_refacciones(
        cantidad,
        precio_aplicado,
        refaccion:refacciones(precio_costo)
      )
    `);

  if (ordersError) throw ordersError;

  const { data: refacciones, error: stockError } = await supabase
    .from('refacciones')
    .select('*')
    .filter('stock', 'lt', 10); // Ejemplo de stock bajo

  if (stockError) throw stockError;

  // Procesar datos para el dashboard
  const stats = orders.reduce((acc, order) => {
    const revenue = (order.costo_final || 0);
    acc.totalRevenue += revenue;
    
    // Calcular costo de refacciones en esta orden
    let orderPartsCost = 0;
    (order.refacciones_usadas as any[]).forEach(item => {
      const cost = item.refaccion?.precio_costo || 0;
      orderPartsCost += (cost * item.cantidad);
    });
    
    acc.totalPartsExpense += orderPartsCost;
    
    // Conteo para conversión
    if (order.estatus !== 'Pendiente' && order.estatus !== 'En Diagnóstico') {
      acc.diagnosedCount++;
      if (order.estatus === 'Listo para Entrega' || order.estatus === 'Entregado') {
        acc.repairedCount++;
      }
    }
    
    // Categorías para el gráfico
    const category = order.equipo?.tipo || 'Otros';
    acc.byCategory[category] = (acc.byCategory[category] || 0) + (order.estatus === 'Entregado' ? 1 : 0);

    // Pago por método
    if (order.metodo_pago) {
      acc.byPaymentMethod[order.metodo_pago] = (acc.byPaymentMethod[order.metodo_pago] || 0) + revenue;
    }

    return acc;
  }, {
    totalRevenue: 0,
    totalPartsExpense: 0,
    diagnosedCount: 0,
    repairedCount: 0,
    byCategory: {} as Record<string, number>,
    byPaymentMethod: {} as Record<string, number>
  });

  return {
    revenue: stats.totalRevenue,
    expense: stats.totalPartsExpense,
    profit: stats.totalRevenue - stats.totalPartsExpense,
    conversionRate: stats.diagnosedCount > 0 ? (stats.repairedCount / stats.diagnosedCount) * 100 : 0,
    categoryData: Object.entries(stats.byCategory).map(([name, value]) => ({ name, value })),
    cashClosing: stats.byPaymentMethod,
    criticalStock: refacciones || []
  };
}

export function exportToCSV(data: any[], fileName: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => 
      typeof val === 'string' ? `"${val}"` : val
    ).join(',')
  );
  
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
