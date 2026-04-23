-- Schema for GAMA Repair Center

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL UNIQUE,
    email TEXT,
    direccion TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('Audio', 'Video', 'Computación', 'Línea Blanca')),
    marca TEXT NOT NULL,
    modelo TEXT,
    serie TEXT,
    estado_fisico TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ordenes_servicio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
    falla_reportada TEXT NOT NULL,
    diagnostico_tecnico TEXT,
    estatus TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estatus IN ('Pendiente', 'En Diagnóstico', 'Esperando Refacción', 'Listo para Entrega', 'Entregado')),
    costo_estimado DECIMAL(10,2) DEFAULT 0,
    costo_final DECIMAL(10,2) DEFAULT 0,
    anticipo DECIMAL(10,2) DEFAULT 0,
    metodo_pago TEXT CHECK (metodo_pago IN ('Efectivo', 'Transferencia', 'Tarjeta')),
    fecha_entrada TIMESTAMPTZ DEFAULT now(),
    fecha_promesa TIMESTAMPTZ,
    folio SERIAL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    precio_costo DECIMAL(10,2) DEFAULT 0,
    precio_venta DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orden_refacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_id UUID REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
    refaccion_id UUID REFERENCES refacciones(id),
    cantidad INTEGER DEFAULT 1,
    precio_aplicado DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Seed Data (Optional for Demo)
INSERT INTO clientes (nombre, telefono, email, direccion) VALUES
('Harold User', '5540455815', 'harold@example.com', 'CDMX, México');

-- 3. Enable RLS (Security) - Simple for now
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE refacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orden_refacciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON clientes FOR ALL USING (true);
CREATE POLICY "Allow all" ON equipos FOR ALL USING (true);
CREATE POLICY "Allow all" ON ordenes_servicio FOR ALL USING (true);
CREATE POLICY "Allow all" ON refacciones FOR ALL USING (true);
CREATE POLICY "Allow all" ON orden_refacciones FOR ALL USING (true);
