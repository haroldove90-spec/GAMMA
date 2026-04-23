import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, CheckCircle2, ChevronLeft, Printer, Download } from 'lucide-react';
import { es } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';

import { cn } from '@/lib/utils';
import { receptionSchema, type ReceptionFormValues } from './receptionSchema';
import { createReceptionOrder } from '../../services/receptionService';
import { OrderTicket, generateQRCode } from './TicketGenerator';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface ReceptionFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function ReceptionForm({ onBack, onSuccess }: ReceptionFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [lastOrder, setLastOrder] = React.useState<any>(null);

  const form = useForm<ReceptionFormValues>({
    resolver: zodResolver(receptionSchema),
    defaultValues: {
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      tipo: '' as any,
      marca: '',
      modelo: '',
      serie: '',
      estadoFisico: '',
      fallaReportada: '',
      costoEstimado: 0,
      anticipo: 0,
      metodoPago: 'Efectivo',
      fechaPromesa: undefined,
    },
  });

  async function handlePrint(order: any, values: ReceptionFormValues) {
    try {
      const qrUrl = await generateQRCode(order.id);
      const ticketData = {
        id: order.id,
        folio: order.folio,
        cliente: {
          nombre: values.nombre,
          telefono: values.telefono,
          email: values.email || undefined,
        },
        equipo: {
          tipo: values.tipo,
          marca: values.marca,
          modelo: values.modelo || undefined,
          serie: values.serie || undefined,
          estadoFisico: values.estadoFisico,
        },
        orden: {
          fallaReportada: values.fallaReportada,
          costoEstimado: values.costoEstimado,
          anticipo: values.anticipo,
          metodoPago: values.metodoPago,
          fechaEntrada: new Date().toISOString(),
          fechaPromesa: values.fechaPromesa?.toISOString(),
        }
      };

      const doc = <OrderTicket data={ticketData} qrCodeUrl={qrUrl} />;
      const asBlob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(asBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al generar ticket:', error);
      toast.error('No se pudo generar el ticket de impresión');
    }
  }

  async function onSubmit(values: ReceptionFormValues) {
    setIsSubmitting(true);
    try {
      const result = await createReceptionOrder(values);
      setIsSubmitting(false);

      if (result.success) {
        toast.success('Orden registrada con éxito');
        setLastOrder({ id: result.ordenId, folio: result.folio, values });
        await handlePrint({ id: result.ordenId, folio: result.folio }, values);
      } else {
        const errorMsg = result.error || 'Error desconocido';
        console.error('Error detallado de registro:', errorMsg);
        
        // Alerta agresiva para diagnóstico
        window.alert(`ERROR AL GUARDAR REGISTRO:\n\n${errorMsg}\n\nDetalle: Verifica si las tablas existen en Supabase y si las credenciales son correctas.`);
        
        toast.error('Error: ' + errorMsg, {
          description: 'Verifica la conexión a la base de datos o si las tablas existen.',
          duration: 10000
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const msg = err?.message || 'Error de excepción';
      window.alert(`EXCEPCIÓN CRÍTICA:\n\n${msg}`);
      toast.error('Excepción: ' + msg);
    }
  }

  if (lastOrder) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center animate-in fade-in zoom-in duration-700">
        <div className="bg-green-50 w-24 h-24 rounded-[30px] flex items-center justify-center mx-auto mb-8 text-green-500 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-[#002D4C] mb-4 uppercase tracking-tighter italic">¡Registro Exitoso!</h2>
        <p className="text-gray-400 font-medium mb-10 text-sm leading-relaxed">
          La orden <span className="text-[#FF4F00] font-black">#GMA-{lastOrder.folio}</span> se ha procesado correctamente. El ticket se ha generado automáticamente.
        </p>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => handlePrint(lastOrder, lastOrder.values)}
            className="h-16 text-xs bg-[#FF4F00] hover:bg-[#e64700] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF4F00]/20 transition-transform active:scale-95"
          >
            <Printer className="mr-3 h-5 w-5" />
            Reimprimir Comprobante
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              form.reset();
              setLastOrder(null);
              if (onSuccess) onSuccess();
            }}
            className="h-16 text-xs border-gray-100 bg-white text-[#002D4C] font-black uppercase tracking-widest rounded-2xl shadow-sm hover:bg-gray-50"
          >
            Nueva Recepción
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => {
              if (onBack) onBack();
            }}
            className="text-gray-300 font-black uppercase text-[10px] tracking-widest mt-4 hover:text-[#002D4C]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Regresar al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mb-10 flex items-center gap-6">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-300 hover:text-[#002D4C] bg-gray-50 rounded-2xl w-12 h-12 shadow-sm">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <div>
          <h2 className="text-4xl font-black text-[#002D4C] tracking-tighter uppercase italic">Nueva Recepción</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Módulo de Ingreso Operativo GAMA</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Sección de Cliente */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-1.5 h-6 bg-[#FF4F00] rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#002D4C]">Datos del Cliente</h3>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Juan Pérez" className="bg-gray-50 border-gray-100 rounded-2xl h-12 text-[11px] font-bold px-6 focus:bg-white transition-all shadow-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp / Tel</FormLabel>
                      <FormControl>
                        <Input placeholder="10 dígitos" className="bg-gray-50 border-gray-100 rounded-2xl h-12 text-[11px] font-bold px-6 focus:bg-white transition-all shadow-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="cliente@gama.com" className="bg-gray-50 border-gray-100 rounded-2xl h-12 text-[11px] font-bold px-6 focus:bg-white transition-all shadow-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Equipo */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-1.5 h-6 bg-[#002D4C] rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#002D4C]">Datos del Equipo</h3>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 border-gray-100 rounded-2xl h-12 text-[11px] font-black uppercase tracking-widest px-6 shadow-sm">
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                          <SelectItem value="Audio" className="text-[11px] font-bold uppercase py-3">Audio</SelectItem>
                          <SelectItem value="Video" className="text-[11px] font-bold uppercase py-3">Video</SelectItem>
                          <SelectItem value="Computación" className="text-[11px] font-bold uppercase py-3">Computación</SelectItem>
                          <SelectItem value="Línea Blanca" className="text-[11px] font-bold uppercase py-3">Línea Blanca</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="p. ej. LG" className="bg-gray-50 border-gray-100 rounded-2xl h-12 text-[11px] font-bold px-6 shadow-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Modelo" className="bg-gray-50 border-gray-100 rounded-2xl h-12 text-[11px] font-bold px-6 shadow-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Orden y Falla */}
          <div className="space-y-8 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-1.5 h-6 bg-[#FF4F00] rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#002D4C]">Diagnóstico de Ingreso</h3>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="fallaReportada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Reporte Síntoma / Falla</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descripción detallada del problema..." 
                        className="min-h-[120px] text-xs font-bold border-gray-100 bg-white rounded-3xl p-6 focus:border-[#FF4F00] shadow-sm italic placeholder:text-gray-200" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="costoEstimado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Presupuesto ($)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#FF4F00]">$</span>
                          <Input 
                            type="number" 
                            className="bg-white border-gray-100 rounded-2xl h-12 pl-8 text-xs font-black text-[#002D4C] shadow-sm"
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="anticipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Anticipo ($)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-green-500">$</span>
                          <Input 
                            type="number" 
                            className="bg-white border-gray-100 rounded-2xl h-12 pl-8 text-xs font-black text-[#002D4C] shadow-sm"
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metodoPago"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Forma de Pago</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-100 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest px-6 shadow-sm">
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-gray-100">
                          <SelectItem value="Efectivo" className="text-[10px] font-bold uppercase py-2">Efectivo</SelectItem>
                          <SelectItem value="Transferencia" className="text-[10px] font-bold uppercase py-2">Transferencia</SelectItem>
                          <SelectItem value="Tarjeta" className="text-[10px] font-bold uppercase py-2">Tarjeta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaPromesa"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400">Compromiso</FormLabel>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              id="date-picker-trigger"
                              variant={"outline"}
                              type="button"
                              className={cn(
                                "w-full h-12 px-6 rounded-2xl bg-white border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-sm text-left flex justify-between items-center hover:bg-gray-50",
                                !field.value && "text-gray-300"
                              )}
                            >
                              <span className="truncate">
                                {field.value ? (
                                  format(field.value, "dd/MM/yy", { locale: es })
                                ) : (
                                  "Fecha..."
                                )}
                              </span>
                              <CalendarIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0,0,0,0))
                            }
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-16 text-xs font-black uppercase tracking-[0.3em] bg-[#002D4C] hover:bg-blue-900 text-white shadow-2xl shadow-[#002D4C]/30 transition-all hover:scale-[1.01] active:scale-95 rounded-2xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sincronizando con Servidor...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Generar Orden de Servicio y Generar Ticket
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
