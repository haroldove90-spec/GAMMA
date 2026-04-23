export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          nombre: string
          telefono: string
          direccion: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          telefono: string
          direccion?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          telefono?: string
          direccion?: string | null
          email?: string | null
          created_at?: string
        }
      }
      equipos: {
        Row: {
          id: string
          cliente_id: string
          tipo: 'Audio' | 'Video' | 'Computación' | 'Línea Blanca'
          marca: string
          modelo: string | null
          serie: string | null
          estado_fisico: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          tipo: 'Audio' | 'Video' | 'Computación' | 'Línea Blanca'
          marca: string
          modelo?: string | null
          serie?: string | null
          estado_fisico?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          tipo?: 'Audio' | 'Video' | 'Computación' | 'Línea Blanca'
          marca?: string
          modelo?: string | null
          serie?: string | null
          estado_fisico?: string | null
          created_at?: string
        }
      }
      ordenes_servicio: {
        Row: {
          id: string
          equipo_id: string
          falla_reportada: string
          diagnostico_tecnico: string | null
          costo_estimado: number
          anticipo: number
          estatus: 'Pendiente' | 'En Diagnóstico' | 'Esperando Refacción' | 'Listo para Entrega' | 'Entregado'
          fecha_entrada: string
          fecha_promesa: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          equipo_id: string
          falla_reportada: string
          diagnostico_tecnico?: string | null
          costo_estimado?: number
          anticipo?: number
          estatus?: 'Pendiente' | 'En Diagnóstico' | 'Esperando Refacción' | 'Listo para Entrega' | 'Entregado'
          fecha_entrada?: string
          fecha_promesa?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          equipo_id?: string
          falla_reportada?: string
          diagnostico_tecnico?: string | null
          costo_estimado?: number
          anticipo?: number
          estatus?: 'Pendiente' | 'En Diagnóstico' | 'Esperando Refacción' | 'Listo para Entrega' | 'Entregado'
          fecha_entrada?: string
          fecha_promesa?: string | null
          updated_at?: string
        }
      }
      refacciones: {
        Row: {
          id: string
          nombre: string
          stock: number
          precio_costo: number
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          stock?: number
          precio_costo?: number
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          stock?: number
          precio_costo?: number
          created_at?: string
        }
      }
      orden_refacciones: {
        Row: {
          id: string
          orden_id: string
          refaccion_id: string
          cantidad: number
          precio_aplicado: number
          created_at: string
        }
        Insert: {
          id?: string
          orden_id: string
          refaccion_id: string
          cantidad?: number
          precio_aplicado: number
          created_at?: string
        }
        Update: {
          id?: string
          orden_id?: string
          refaccion_id?: string
          cantidad?: number
          precio_aplicado?: number
          created_at?: string
        }
      }
    }
  }
}
