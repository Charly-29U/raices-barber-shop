-- =============================================================================
-- RAÍCES BARBER SHOP - ESTRUCTURA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- =============================================================================

-- 1. Tabla de Citas y Reservas
CREATE TABLE IF NOT EXISTS citas (
  id TEXT PRIMARY KEY,
  codigo TEXT,
  cliente JSONB NOT NULL,
  servicio TEXT NOT NULL,
  barbero TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  total NUMERIC NOT NULL DEFAULT 0,
  anticipo_pagado NUMERIC NOT NULL DEFAULT 0,
  saldo_pendiente NUMERIC NOT NULL DEFAULT 0,
  comprobante TEXT,
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  notas TEXT,
  recordatorio_enviado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Servicios y Cortes
CREATE TABLE IF NOT EXISTS servicios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC NOT NULL,
  anticipo NUMERIC NOT NULL,
  duracion INTEGER NOT NULL DEFAULT 45,
  imagen TEXT,
  activo BOOLEAN DEFAULT TRUE,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Barberos
CREATE TABLE IF NOT EXISTS barberos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  rol TEXT,
  especialidad TEXT,
  foto TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Cuentas Bancarias
CREATE TABLE IF NOT EXISTS bancos (
  id TEXT PRIMARY KEY,
  banco TEXT NOT NULL,
  numero TEXT NOT NULL,
  titular TEXT NOT NULL,
  tipo TEXT,
  instrucciones TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Configuración General
CREATE TABLE IF NOT EXISTS configuracion (
  clave TEXT PRIMARY KEY,
  valor JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) permisivo para lectura y escritura
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE barberos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bancos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso universal
DROP POLICY IF EXISTS "Permitir todo en citas" ON citas;
CREATE POLICY "Permitir todo en citas" ON citas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en servicios" ON servicios;
CREATE POLICY "Permitir todo en servicios" ON servicios FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en barberos" ON barberos;
CREATE POLICY "Permitir todo en barberos" ON barberos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en bancos" ON bancos;
CREATE POLICY "Permitir todo en bancos" ON bancos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en configuracion" ON configuracion;
CREATE POLICY "Permitir todo en configuracion" ON configuracion FOR ALL USING (true) WITH CHECK (true);

-- Insertar Datos Iniciales por Defecto si no existen
INSERT INTO servicios (id, nombre, descripcion, precio, anticipo, duracion, imagen, orden)
VALUES 
  ('srv-1', 'Corte Imperial & Degradado VIP', 'Corte de alta gama personalizado, degradado a cero o a navaja y peinado estructurado con cera mate de fijación fuerte.', 35000, 17500, 45, 'assets/corte1.png', 1),
  ('srv-2', 'Diseño de Barba & Toalla Caliente', 'Perfilado preciso a navaja japonesa, recorte milimétrico, exfoliación facial y tratamiento aromático con toallas calientes.', 25000, 12500, 35, 'assets/corte2.png', 2),
  ('srv-3', 'Ritual Raíces Completo (Corte + Barba)', 'La experiencia definitiva: Corte de autor, tratamiento completo de barba, toalla caliente y vapor de ozono.', 55000, 27500, 75, 'assets/corte3.png', 3),
  ('srv-4', 'Afeitado Tradicional al Ras', 'Afeitado clásico a navaja con espuma tibia en brocha de tejón, masaje facial revitalizante y loción aftershave artesanal.', 28000, 14000, 40, 'assets/corte4.png', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO barberos (id, nombre, rol, especialidad, foto, activo)
VALUES 
  ('barb-1', 'Carlos Mendoza', 'Master Barber & Fundador', 'Especialista en degradados milimétricos, cortes clásicos y visagismo facial.', 'assets/corte1.png', true),
  ('barb-2', 'Sebastián Restrepo', 'Senior Barber Stylist', 'Maestro en diseño de barbas, afeitado tradicional a navaja y estilo urbano.', 'assets/corte2.png', true),
  ('barb-3', 'Alejandro Morales', 'Colorista & Artista Capilar', 'Experto en texturizados modernos, líneas de autor y cuidado capilar de lujo.', 'assets/corte3.png', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bancos (id, banco, numero, titular, tipo, instrucciones, activo)
VALUES 
  ('nequi', 'Nequi', '3128914738', 'Raíces Barber Shop', 'Billetera Digital', 'Abre tu Nequi, transfiere a número de celular y envía captura al finalizar tu cita.', true),
  ('bancolombia', 'Bancolombia', '04829104829', 'Raíces Barber Shop', 'Ahorros', 'Transfiere desde la App Bancolombia o por QR. Válido desde cualquier banco con Transfiya.', true),
  ('nu', 'Nu Colombia', '573128914738', 'Raíces Barber Shop', 'Cuenta de Ahorros Nu', 'Transfiere desde Nu o por Transfiya a la Cuenta de Ahorros Nu.', true),
  ('davivienda', 'Davivienda / Daviplata', '055084721920', 'Raíces Barber Shop', 'Daviplata o Ahorros', 'Daviplata o Ahorros al 312 891 4738.', true)
ON CONFLICT (id) DO NOTHING;
