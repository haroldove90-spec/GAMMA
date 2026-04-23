import * as React from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  Clock, 
  User, 
  MessageCircle, 
  Save, 
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Package,
  HardDrive,
  LayoutDashboard,
  ClipboardList,
  AlertTriangle
} from 'lucide-react';
import { format, isPast, isToday, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Tipos locales basados en el esquema
type Status = 'Pendiente' | 'En Diagnóstico' | 'Esperando Refacción' | 'Listo para Entrega' | 'Entregado';
type Category = 'Audio' | 'Video' | 'Computación' | 'Línea Blanca';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  equipment: string;
  category: Category;
  status: Status;
  falla: string;
  diagnostico?: string;
  fechaPromesa?: Date;
  costo: number;
}

// Datos de ejemplo para visualización
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'GMA-1024',
    customerName: 'Ricardo Mendez',
    phone: '5512345678',
    equipment: 'Smart TV Samsung 55"',
    category: 'Video',
    status: 'En Diagnóstico',
    falla: 'Pantalla con rayas horizontales',
    fechaPromesa: addDays(new Date(), -1),
    costo: 1200,
  },
  {
    id: '2',
    orderNumber: 'GMA-1025',
    customerName: 'Elena Guerrero',
    phone: '5587654321',
    equipment: 'MacBook Pro 14" M2',
    category: 'Computación',
    status: 'Pendiente',
    falla: 'No enciende tras derrame de líquido',
    fechaPromesa: addDays(new Date(), 2),
    costo: 3500,
  },
  {
    id: '3',
    orderNumber: 'GMA-1026',
    customerName: 'Audio Design S.A.',
    phone: '5555555555',
    equipment: 'Amplificador Marantz',
    category: 'Audio',
    status: 'Esperando Refacción',
    falla: 'Canal derecho con distorsión',
    fechaPromesa: addDays(new Date(), 0),
    costo: 450,
  },
  {
    id: '4',
    orderNumber: 'GMA-1027',
    customerName: 'Julian Ortega',
    phone: '5522334455',
    equipment: 'PS5 Digital Edition',
    category: 'Video',
    status: 'Listo para Entrega',
    falla: 'Mantenimiento preventivo y limpieza',
    fechaPromesa: addDays(new Date(), 1),
    costo: 600,
  }
];

import { getWorkshopOrders, updateOrderDiagnostics } from '../../services/workshopService';

export function WorkshopDashboard() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [diagnostico, setDiagnostico] = React.useState('');
  const [status, setStatus] = React.useState<Status>('Pendiente');
  const [costo, setCosto] = React.useState(0);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  React.useEffect(() => {
    if (selectedOrder) {
      setDiagnostico(selectedOrder.diagnostico || '');
      setStatus(selectedOrder.status);
      setCosto(selectedOrder.costo);
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      const data = await getWorkshopOrders();
      const mapped = data.map((o: any) => ({
        id: o.id,
        orderNumber: `GMA-${o.folio}`,
        customerName: o.equipo?.cliente?.nombre || 'S/N',
        phone: o.equipo?.cliente?.telefono || '',
        equipment: `${o.equipo?.marca} ${o.equipo?.modelo || ''}`,
        category: o.equipo?.tipo as Category,
        status: o.estatus as Status,
        falla: o.falla_reportada,
        diagnostico: o.diagnostico_tecnico,
        fechaPromesa: o.fecha_promesa ? new Date(o.fecha_promesa) : undefined,
        costo: Number(o.costo_final || o.costo_estimado) || 0,
      }));
      setOrders(mapped);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedOrder) return;
    try {
      toast.loading('Guardando cambios...', { id: 'save' });
      await updateOrderDiagnostics(selectedOrder.id, {
        estatus: status,
        diagnostico_tecnico: diagnostico,
        costo_final: costo
      });
      toast.success('Bitácora técnica actualizada', { id: 'save' });
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error('Error al guardar datos', { id: 'save' });
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.equipment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendWhatsApp = (order: Order) => {
    // Si el usuario proporcionó un número específico para pruebas, podríamos usarlo, 
    // pero lo correcto es usar el de la orden.
    const message = `🛠️ *GAMA REPAIR CENTER*\n\nHola *${order.customerName}*, le informamos sobre el estatus de su *${order.equipment}* (Folio: ${order.orderNumber}):\n\n✅ *Estatus:* ${status}\n📝 *Diagnóstico:* ${diagnostico || 'En revisión'}\n💰 *Costo Est.:* $${costo}\n\nQuedamos a sus órdenes.`;
    const url = `https://wa.me/52${order.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]" />
    </div>
  );

  return (
    <div className="bg-transparent min-h-screen text-gray-800 p-0 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3 text-[#002D4C]">
              <Wrench className="w-10 h-10 text-[#FF4F00]" />
              Control del Taller
            </h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Gestión Técnica Operativa</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Buscar orden o equipo..." 
                className="pl-12 bg-white border-none rounded-2xl h-12 shadow-xl shadow-gray-200/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-2xl border-none bg-white shadow-xl shadow-gray-200/50">
              <Filter className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Board View / Status Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          <StatusColumn 
            title="Pendientes" 
            count={orders.filter(o => o.status === 'Pendiente').length} 
            color="border-gray-200"
            orders={filteredOrders.filter(o => o.status === 'Pendiente')}
            onOrderClick={setSelectedOrder}
          />
          <StatusColumn 
            title="En Diagnóstico" 
            count={orders.filter(o => o.status === 'En Diagnóstico').length} 
            color="border-blue-200"
            orders={filteredOrders.filter(o => o.status === 'En Diagnóstico')}
            onOrderClick={setSelectedOrder}
          />
          <StatusColumn 
            title="Esperando Refacción" 
            count={orders.filter(o => o.status === 'Esperando Refacción').length} 
            color="border-orange-200"
            orders={filteredOrders.filter(o => o.status === 'Esperando Refacción')}
            onOrderClick={setSelectedOrder}
          />
          <StatusColumn 
            title="Listo para Entrega" 
            count={orders.filter(o => o.status === 'Listo para Entrega').length} 
            color="border-green-200"
            orders={filteredOrders.filter(o => o.status === 'Listo para Entrega')}
            onOrderClick={setSelectedOrder}
          />
        </div>

        {/* Modal de Detalle */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          {selectedOrder && (
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-[40px] border-none shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Panel: Info */}
                <div className="p-6 lg:p-10 bg-[#002D4C] text-white space-y-8">
                  <div>
                    <Badge className="bg-[#FF4F00] text-white border-none text-[9px] font-black uppercase px-3 py-0.5 rounded-lg mb-4">
                      {selectedOrder.status}
                    </Badge>
                    <h2 className="text-3xl font-black tracking-tighter leading-none mb-2">{selectedOrder.orderNumber}</h2>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Registrado: 23 Abr 2024</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#FF4F00]" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Cliente</p>
                        <p className="text-[11px] font-bold">{selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                        <HardDrive className="w-4 h-4 text-[#FF4F00]" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Equipo</p>
                        <p className="text-[11px] font-bold">{selectedOrder.equipment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl">
                     <p className="text-[9px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                       <AlertTriangle className="w-3 h-3" />
                       Falla Reportada
                     </p>
                     <p className="text-[10px] font-bold text-red-200 italic">"{selectedOrder.falla}"</p>
                  </div>
                </div>

                {/* Right Panel: Actions */}
                <div className="md:col-span-2 p-6 lg:p-10 space-y-8">
                  <DialogHeader className="p-0 space-y-0">
                    <DialogTitle className="text-xl font-black uppercase tracking-tight text-[#002D4C]">Bitácora Técnica</DialogTitle>
                    <DialogDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actualización de diagnóstico y progreso</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Diagnóstico Técnico</label>
                      <Textarea 
                        placeholder="Describe el problema técnico detectado..." 
                        className="bg-gray-50 border-gray-100 rounded-3xl min-h-[120px] p-6 text-[11px] font-medium placeholder:text-gray-300 focus:bg-white transition-all outline-none"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Cambiar Estado</label>
                        <Select value={status} onValueChange={(val: Status) => setStatus(val)}>
                          <SelectTrigger className="bg-gray-50 border-gray-100 rounded-2xl h-12 text-[11px] font-black uppercase tracking-wide">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En Diagnóstico">En Diagnóstico</SelectItem>
                            <SelectItem value="Esperando Refacción">Esperando Refacción</SelectItem>
                            <SelectItem value="Listo para Entrega">Listo para Entrega</SelectItem>
                            <SelectItem value="Entregado">Entregado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest">Costo Estimado</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#FF4F00]">$</span>
                          <Input 
                            type="number" 
                            value={costo}
                            onChange={(e) => setCosto(Number(e.target.value))}
                            className="bg-gray-50 border-gray-100 rounded-2xl h-12 pl-8 font-black text-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    <div className="flex gap-4 w-full sm:w-auto">
                      <Button 
                        variant="secondary"
                        className="bg-green-500 hover:bg-green-600 text-white font-black uppercase text-[9px] tracking-widest px-6 h-12 rounded-2xl shadow-xl shadow-green-500/20 flex-1 sm:flex-none"
                        onClick={() => sendWhatsApp(selectedOrder)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WA
                      </Button>
                    </div>
                    <Button 
                      className="w-full sm:w-auto bg-[#002D4C] hover:bg-blue-900 text-white font-black uppercase text-[10px] tracking-widest h-14 px-10 rounded-2xl shadow-xl shadow-blue-900/20 transition-transform active:scale-95"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Bitácora
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}

function StatusColumn({ title, count, color, orders, onOrderClick }: any) {
  return (
    <div className="space-y-6">
      <div className={cn("pb-4 border-b-2 flex justify-between items-center px-2", color)}>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#002D4C]">{title}</h3>
        <span className="bg-[#002D4C] text-white text-[9px] font-black px-3 py-1 rounded-full">{count}</span>
      </div>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <OrderCard key={order.id} order={order} onClick={() => onOrderClick(order)} />
        ))}
        {orders.length === 0 && (
          <div className="p-10 border-2 border-dashed border-gray-100 rounded-[35px] flex flex-col items-center justify-center text-center opacity-30">
             <CheckCircle2 className="w-8 h-8 text-gray-300 mb-3" />
             <p className="text-[9px] font-black uppercase tracking-widest">Sin Pendientes</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const isExpired = order.fechaPromesa && isPast(order.fechaPromesa) && !isToday(order.fechaPromesa);
  const isUrgent = order.fechaPromesa && isToday(order.fechaPromesa);

  return (
    <Card 
      className="bg-white rounded-[35px] shadow-xl shadow-gray-200/50 border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer group p-2"
      onClick={onClick}
    >
      <CardContent className="p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <span className="text-[9px] font-black text-gray-300 tracking-widest">{order.orderNumber}</span>
          <div className="flex gap-1.5">
            {isExpired && (
              <div className="bg-red-100 text-red-500 p-1.5 rounded-lg">
                <AlertTriangle className="w-3 h-3" />
              </div>
            )}
            {order.status === 'Listo para Entrega' && (
              <div className="bg-green-100 text-green-500 p-1.5 rounded-lg">
                <CheckCircle2 className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-black text-[#002D4C] uppercase leading-tight tracking-tight mb-2 group-hover:text-[#FF4F00] transition-colors line-clamp-2">
            {order.equipment}
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-2 h-2 text-gray-400" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 truncate">{order.customerName}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-gray-50">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-3 h-3" />
            <span className="text-[9px] font-black">
              {order.fechaPromesa ? format(order.fechaPromesa, 'dd MMM', { locale: es }) : 'N/A'}
            </span>
          </div>
          <p className="text-sm font-black text-[#002D4C] leading-none tracking-tighter">${order.costo}</p>
        </div>
      </CardContent>
    </Card>
  );
}
