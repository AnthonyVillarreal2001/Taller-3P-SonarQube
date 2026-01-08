-- Script para carga inicial de datos en la base de datos parking_db
-- Asume que las tablas zones y spaces ya están creadas.

-- Limpiar tablas existentes (opcional, para reiniciar datos)
TRUNCATE TABLE spaces RESTART IDENTITY CASCADE;
TRUNCATE TABLE zones RESTART IDENTITY CASCADE;

-- Insertar datos iniciales en zones
INSERT INTO zones (name, description) VALUES
('Zona A', 'Zona principal cerca de la entrada'),
('Zona B', 'Zona secundaria con sombra'),
('Zona C', 'Zona para vehículos grandes');

-- Insertar datos iniciales en spaces (referenciando zone_id)
INSERT INTO spaces (zone_id, number, status) VALUES
(1, 'A1', 'Disponible'),
(1, 'A2', 'Ocupado'),
(1, 'A3', 'Disponible'),
(2, 'B1', 'Disponible'),
(2, 'B2', 'Disponible'),
(2, 'B3', 'Ocupado'),
(3, 'C1', 'Disponible'),
(3, 'C2', 'Disponible'),
(3, 'C3', 'Disponible');