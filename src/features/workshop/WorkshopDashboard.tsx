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
  HardDrive
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

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
    orderNumber: 'ORD-1024',
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
    orderNumber: 'ORD-1025',
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
    orderNumber: 'ORD-1026',
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
    orderNumber: 'ORD-1027',
    customerName: 'Julian Ortega',
    phone: '5522334455',
    equipment: 'PS5 Digital Edition',
    category: 'Video',
    status: 'Listo para Entrega',
    falla: 'Mantenimiento preventivo y limpieza',
    fechaPromesa: addDays(new Date(), 1),
    costo: 800,
  },
  {
    id: '5',
    orderNumber: 'ORD-1028',
    customerName: 'Maria Casas',
    phone: '5544332211',
    equipment: 'Refrigerador LG Thin Q',
    category: 'Línea Blanca',
    status: 'Pendiente',
    falla: 'No enfría correctamente la parte de arriba',
    fechaPromesa: addDays(new Date(), 5),
    costo: 0,
  }
];

export function WorkshopDashboard() {
  const [orders, setOrders] = React.useState<Order[]>(MOCK_ORDERS);
  const [filterCategory, setFilterCategory] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  
  // Filtrado en tiempo real
  const filteredOrders = orders.filter(order => {
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const columns: Status[] = ['Pendiente', 'En Diagnóstico', 'Esperando Refacción', 'Listo para Entrega'];

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    if (newStatus === 'Listo para Entrega') {
      const order = orders.find(o => o.id === id);
      if (order) {
        toast.success(`Orden ${order.orderNumber} marcada como Lista`);
      }
    }
  };

  const sendWhatsApp = (order: Order) => {
    const message = `Hola ${order.customerName}, tu equipo ${order.equipment} ya está listo en GAMA. El costo final es $${order.costo}. ¡Te esperamos!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${order.phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-[#f0f2f5] min-h-full p-4 md:p-8 font-sans">
      {/* Header del Dashboard */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-black text-[#002855] tracking-tight flex items-center gap-2">
              <Wrench className="w-8 h-8 text-[#FF6B35]" />
              Taller de Reparación
            </h2>
            <p className="text-gray-500 font-medium">Control operativo de flujo de trabajo GAMA.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                className="pl-10 bg-white border-gray-200" 
                placeholder="Buscar cliente, orden o equipo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] bg-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Computación">Computación</SelectItem>
                <SelectItem value="Línea Blanca">Línea Blanca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map(status => (
          <div key={status} className="flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-3 h-3 rounded-full",
                  status === 'Pendiente' && "bg-gray-400",
                  status === 'En Diagnóstico' && "bg-blue-500",
                  status === 'Esperando Refacción' && "bg-orange-500 animate-pulse",
                  status === 'Listo para Entrega' && "bg-green-500"
                )} />
                <h3 className="font-bold text-[#002855] uppercase text-xs tracking-widest">{status}</h3>
              </div>
              <Badge variant="outline" className="bg-white/50 text-[#002855] border-none font-bold">
                {filteredOrders.filter(o => o.status === status).length}
              </Badge>
            </div>

            <ScrollArea className="flex-1 bg-gray-200/50 rounded-xl p-3 border border-dashed border-gray-300">
              <div className="space-y-4">
                {filteredOrders
                  .filter(order => order.status === status)
                  .map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onClick={() => setSelectedOrder(order)} 
                    />
                  ))
                }
                {filteredOrders.filter(o => o.status === status).length === 0 && (
                  <div className="text-center py-10 opacity-30 select-none">
                    <p className="text-xs uppercase font-bold tracking-widest">Sin órdenes</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>

      {/* Modal de Actualización */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl bg-[#f8f9fa] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-[#002855] p-6 text-white text-sm uppercase tracking-[0.2em] font-bold">
               Control de Orden: {selectedOrder.orderNumber}
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Equipo / Categoría</label>
                  <p className="text-xl font-black text-[#002855] leading-tight">{selectedOrder.equipment}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                    {selectedOrder.category}
                  </Badge>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Cliente</label>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#FF6B35]" />
                    <p className="text-lg font-bold text-[#002855]">{selectedOrder.customerName}</p>
                  </div>
                  <p className="text-sm font-mono text-blue-500 mt-1">WA: {selectedOrder.phone}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#002855] mb-2 block">Actualizar Estatus</label>
                  <Select 
                    defaultValue={selectedOrder.status}
                    onValueChange={(val) => handleUpdateStatus(selectedOrder.id, val as Status)}
                  >
                    <SelectTrigger className="w-full h-12 bg-white border-2 focus:ring-[#FF6B35]">
                      <SelectValue placeholder="Seleccionar nuevo estado" />
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
                  <label className="text-[10px] uppercase font-bold text-[#002855] mb-2 block">Bitácora Técnica</label>
                  <Textarea 
                    placeholder="Escribe aquí el avance del diagnóstico o notas sobre las reparaciones realizadas..." 
                    className="min-h-[120px] bg-white border-2" 
                    defaultValue={selectedOrder.diagnostico}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#002855] mb-2 block">Refacciones Usadas</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="w-full bg-white border-dashed border-2 hover:border-[#FF6B35] group">
                        <Package className="w-4 h-4 mr-2 group-hover:text-[#FF6B35]" />
                        Vincular Pieza
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#002855] mb-2 block">Costo Final de Reparación</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                      <Input 
                        type="number" 
                        defaultValue={selectedOrder.costo} 
                        className="pl-8 bg-white border-2 text-lg font-bold" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-gray-100/50 flex items-center justify-between border-t">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedOrder(null)}
                  className="font-bold text-[#002855]"
                >
                  Cancelar
                </Button>
                {selectedOrder.status === 'Listo para Entrega' && (
                  <Button 
                    variant="secondary"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold gap-2"
                    onClick={() => sendWhatsApp(selectedOrder)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Notificar Cliente
                  </Button>
                )}
              </div>
              <Button 
                onClick={() => {
                  toast.success('Información actualizada correctamente');
                  setSelectedOrder(null);
                }}
                className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-black uppercase tracking-widest px-8"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const isExpired = order.fechaPromesa && isPast(order.fechaPromesa) && !isToday(order.fechaPromesa);
  const isUrgent = order.fechaPromesa && isToday(order.fechaPromesa);

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-none bg-white overflow-hidden relative"
      onClick={onClick}
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5",
        order.status === 'Pendiente' && "bg-gray-300",
        order.status === 'En Diagnóstico' && "bg-blue-500",
        order.status === 'Esperando Refacción' && "bg-orange-500",
        order.status === 'Listo para Entrega' && "bg-green-500"
      )} />
      
      <CardContent className="p-4 pl-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-mono text-gray-400 font-bold tracking-tighter">{order.orderNumber}</span>
          {isExpired && (
            <Badge className="bg-red-500 text-[9px] uppercase font-black border-none animate-pulse">VENCIDO</Badge>
          )}
          {isUrgent && (
            <Badge className="bg-orange-500 text-[9px] uppercase font-black border-none">ENTREGA HOY</Badge>
          )}
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-black text-[#002855] leading-tight uppercase group-hover:text-[#FF6B35] transition-colors">{order.equipment}</h4>
          <div className="flex items-center gap-1.5 mt-1 opacity-60">
            <User className="w-3 h-3" />
            <p className="text-[11px] font-medium truncate">{order.customerName}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-bold">
              {order.fechaPromesa ? format(order.fechaPromesa, 'dd MMM', { locale: es }) : 'N/A'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
