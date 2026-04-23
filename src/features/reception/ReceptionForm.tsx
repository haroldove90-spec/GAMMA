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
      marca: '',
      modelo: '',
      serie: '',
      estadoFisico: '',
      fallaReportada: '',
      costoEstimado: 0,
      anticipo: 0,
    },
  });

  async function handlePrint(order: any, values: ReceptionFormValues) {
    try {
      const qrUrl = await generateQRCode(order.id);
      const ticketData = {
        id: order.id,
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
    const result = await createReceptionOrder(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Orden registrada con éxito');
      setLastOrder({ id: result.ordenId, values });
      // Generar y mostrar ticket
      await handlePrint({ id: result.ordenId }, values);
      
      // No reseteamos inmediatamente para permitir reimprimir si es necesario
      // Pero podemos dar la opción de salir
    } else {
      toast.error('Error al registrar orden: ' + result.error);
    }
  }

  if (lastOrder) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-[#002D4C] mb-2 uppercase">¡Registro Exitoso!</h2>
        <p className="text-gray-500 mb-8">La orden #{lastOrder.id.substring(0, 8).toUpperCase()} se ha guardado correctamente en la nube.</p>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => handlePrint(lastOrder, lastOrder.values)}
            className="h-16 text-xl bg-[#FF4F00] hover:bg-[#e64700] text-white font-bold"
          >
            <Printer className="mr-2 h-6 w-6" />
            Reimprimir Ticket
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              form.reset();
              setLastOrder(null);
              if (onSuccess) onSuccess();
            }}
            className="h-16 text-xl border-[#002855] text-[#002855] font-bold"
          >
            Nueva Recepción
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => {
              if (onBack) onBack();
            }}
            className="text-gray-400 font-bold"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="text-[#002855]">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <div>
          <h2 className="text-3xl font-black text-[#002855] tracking-tight">Nueva Recepción</h2>
          <p className="text-gray-500 text-sm">Registro de cliente y equipo para soporte técnico.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sección de Cliente */}
            <Card className="border-t-4 border-t-[#FF6B35] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#002855] flex items-center gap-2">
                  <div className="w-2 h-6 bg-[#FF6B35] rounded-full" />
                  Datos del Cliente
                </CardTitle>
                <CardDescription>Información de contacto del propietario.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Juan Pérez" {...field} />
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
                      <FormLabel>Teléfono / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="10 dígitos" {...field} />
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
                      <FormLabel>Correo Electrónico (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="cliente@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Dirección del cliente" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sección de Equipo */}
            <Card className="border-t-4 border-t-[#002855] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#002855] flex items-center gap-2">
                  <div className="w-2 h-6 bg-[#002855] rounded-full" />
                  Datos del Equipo
                </CardTitle>
                <CardDescription>Detalles técnicos del dispositivo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Equipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Audio">Audio</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Computación">Computación</SelectItem>
                          <SelectItem value="Línea Blanca">Línea Blanca</SelectItem>
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
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Sony" {...field} />
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
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. WH-1000XM4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="serie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Serie</FormLabel>
                      <FormControl>
                        <Input placeholder="S/N" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estadoFisico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Físico / Estética</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Rayones, golpes, falta de botones..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sección de Orden y Falla */}
          <Card className="border-t-4 border-t-[#FF6B35] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#002855] flex items-center gap-2">
                <div className="w-2 h-6 bg-[#FF6B35] rounded-full" />
                Diagnóstico Inicial y Promesa
              </CardTitle>
              <CardDescription>Motivo de ingreso y tiempos estimados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="fallaReportada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">Falla Reportada</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descripción detallada del problema que reporta el cliente..." 
                        className="min-h-[100px] text-lg border-2 focus:border-[#FF6B35]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="costoEstimado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo Estimado ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
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
                      <FormLabel>Anticipo ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaPromesa"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha Promesa Entrega</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
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
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-16 text-xl font-black uppercase tracking-widest bg-[#002855] hover:bg-[#001d3d] text-white shadow-xl transition-all hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-6 w-6" />
                Registrar Ingreso de Equipo
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
