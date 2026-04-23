import * as z from 'zod';

export const receptionSchema = z.object({
  // Cliente
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  
  // Equipo
  tipo: z.enum(['Audio', 'Video', 'Computación', 'Línea Blanca'], {
    errorMap: () => ({ message: 'Selecciona un tipo de equipo válido' }),
  }),
  marca: z.string().min(1, 'La marca es obligatoria'),
  modelo: z.string().optional(),
  serie: z.string().optional(),
  estadoFisico: z.string().min(5, 'Describe el estado físico del equipo'),
  
  // Orden
  fallaReportada: z.string().min(5, 'La descripción de la falla es obligatoria'),
  costoEstimado: z.number().min(0, 'El costo no puede ser negativo').default(0),
  anticipo: z.number().min(0, 'El anticipo no puede ser negativo').default(0),
  metodoPago: z.enum(['Efectivo', 'Transferencia', 'Tarjeta']).optional().default('Efectivo'),
  fechaPromesa: z.date().optional(),
}).refine((data) => data.anticipo <= data.costoEstimado, {
  message: "El anticipo no puede ser mayor al costo estimado",
  path: ["anticipo"],
});

export type ReceptionFormValues = z.infer<typeof receptionSchema>;
