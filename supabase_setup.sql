-- SQL PARA SUPABASE - COPIAR Y PEGAR EN EL SQL EDITOR DE SUPABASE
-- ESTO CREARÁ LA ESTRUCTURA NECESARIA PARA GAMA REPAIR CENTER

-- 1. Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    telefono TEXT UNIQUE NOT NULL,
    email TEXT,
    direccion TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Equipos
CREATE TABLE IF NOT EXISTS equipos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo TEXT CHECK (tipo IN ('Audio', 'Video', 'Computación', 'Línea Blanca')),
    marca TEXT NOT NULL,
    modelo TEXT,
    serie TEXT,
    estado_fisico TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Ordenes de Servicio
CREATE TABLE IF NOT EXISTS ordenes_servicio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio SERIAL UNIQUE,
    equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
    falla_reportada TEXT NOT NULL,
    diagnostico_tecnico TEXT,
    costo_estimado DECIMAL DEFAULT 0,
    costo_final DECIMAL,
    anticipo DECIMAL DEFAULT 0,
    metodo_pago TEXT CHECK (metodo_pago IN ('Efectivo', 'Transferencia', 'Tarjeta')),
    estatus TEXT DEFAULT 'Pendiente' CHECK (estatus IN ('Pendiente', 'En Diagnóstico', 'Esperando Refacción', 'Listo para Entrega', 'Entregado')),
    fecha_entrada TIMESTAMPTZ DEFAULT now(),
    fecha_promesa TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Inventario de Refacciones
CREATE TABLE IF NOT EXISTS refacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    precio_costo DECIMAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Relación Orden-Refacciones
CREATE TABLE IF NOT EXISTS orden_refacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_id UUID REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
    refaccion_id UUID REFERENCES refacciones(id) ON DELETE CASCADE,
    cantidad INTEGER DEFAULT 1,
    precio_aplicado DECIMAL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- IMPORTANTE: DESHABILITAR RLS PARA PERMITIR ESCRITURA DIRECTA DURANTE EL DESARROLLO
-- SI DESEAS SEGURIDAD, DEBES CREAR POLÍTICAS (POLICIES) EN LUGAR DE DESHABILITARLO
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE equipos DISABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_servicio DISABLE ROW LEVEL SECURITY;
ALTER TABLE refacciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE orden_refacciones DISABLE ROW LEVEL SECURITY;
