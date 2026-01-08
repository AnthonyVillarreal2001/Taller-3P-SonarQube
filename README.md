# Parking Vulnerable App - Sistema de Gestión de Estacionamiento

Aplicación web vulnerable para demostración de análisis con SonarQube.

## 📋 Requisitos Previos

- **Docker Desktop** instalado y ejecutándose
- **Node.js** (versión 14 o superior)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Inicio Rápido (Recomendado)

### Opción 1: Usar Docker Compose (Más Fácil)

```bash
# 1. Iniciar todos los servicios
docker-compose up -d

# 2. Esperar 10 segundos para que PostgreSQL inicie

# 3. Crear tablas y cargar datos (PowerShell)
Get-Content backend/sql/tablas.sql | docker exec -i parking-postgres psql -U postgres -d parking_db
Get-Content backend/sql/carga_inicial.sql | docker exec -i parking-postgres psql -U postgres -d parking_db

# 4. Instalar dependencias del backend
cd backend
npm install

# 5. Iniciar el backend
npm start

# 6. Abrir el frontend en tu navegador
# Navega a: frontend/index.html
# O usa: npx http-server frontend -p 8080
```

### Opción 2: Script Automatizado (Windows)

```bash
# Ejecuta el script que hace todo por ti
.\start.bat
```

### Opción 3: Configuración Manual (PowerShell en Windows)

#### 1. Base de Datos (PostgreSQL)

```powershell
# Crear y ejecutar contenedor PostgreSQL
docker run --name parking-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=parking_db -p 5433:5432 -d postgres:14

# Esperar 8 segundos para que inicie
Start-Sleep -Seconds 8

# Ejecutar scripts SQL (desde la raíz del proyecto)
Get-Content backend/sql/tablas.sql | docker exec -i parking-postgres psql -U postgres -d parking_db
Get-Content backend/sql/carga_inicial.sql | docker exec -i parking-postgres psql -U postgres -d parking_db
```

#### 2. Backend (Node.js + Express)

```powershell
cd backend
npm install
npm start
```

El API estará disponible en **http://localhost:3000**

#### 3. Frontend (ExtJS)

El frontend usa ExtJS desde CDN y no necesita instalación.

**Opción A - Servidor HTTP:**
```powershell
npx http-server frontend -p 8080
```
Accede a: **http://localhost:8080**

**Opción B - Abrir directamente:**
Abre `frontend/index.html` en tu navegador

## 🔧 Configuración

### Variables de Entorno

El archivo `.env.example` contiene la plantilla. Copia y renombra a `.env` si necesitas personalizar:

```env
DB_USER=postgres
DB_HOST=127.0.0.1
DB_NAME=parking_db
DB_PASSWORD=postgres
DB_PORT=5433
PORT=3000
```

## 📊 Análisis con SonarQube

### Iniciar SonarQube (si no está corriendo)

```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

Accede a: **http://localhost:9000** (usuario: `admin`, contraseña: `admin`)

### Ejecutar Análisis

1. Crea el proyecto en SonarQube con key: `parking-vulnerable-app`
2. Genera un token de análisis
3. Ejecuta:

```bash
# Windows
run-sonar-scan.bat

# O manualmente
.\run-sonar-scan.bat
```

## 🛠️ Comandos Útiles

### Backend
```bash
cd backend
npm install          # Instalar dependencias
npm start           # Iniciar servidor
```

### Base de Datos
```bash
# Detener PostgreSQL
docker stop parking-postgres

# Iniciar PostgreSQL existente
docker start parking-postgres

# Ver logs
docker logs parking-postgres

# Conectarse a la base de datos
docker exec -it parking-postgres psql -U postgres -d parking_db

# Eliminar y recrear
docker rm -f parking-postgres
```

### Docker Compose
```bash
# Iniciar todos los servicios
docker-compose up -d

# Detener todos los servicios
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📁 Estructura del Proyecto

```
├── backend/
│   ├── config/
│   │   └── db.js              # Configuración de base de datos
│   ├── routes/
│   │   ├── spaces.js          # Rutas de espacios
│   │   └── zones.js           # Rutas de zonas
│   ├── sql/
│   │   ├── tablas.sql         # Esquema de base de datos
│   │   └── carga_inicial.sql  # Datos iniciales
│   ├── .env.example           # Plantilla de variables de entorno
│   ├── package.json
│   └── server.js              # Servidor principal
├── frontend/
│   ├── app/
│   │   ├── controller/        # Controladores ExtJS
│   │   ├── model/             # Modelos de datos
│   │   ├── store/             # Stores de datos
│   │   └── view/              # Vistas/Grids
│   ├── app.js                 # Aplicación ExtJS
│   └── index.html             # Página principal
├── docker-compose.yml         # Configuración Docker Compose
├── sonar-project.properties   # Configuración SonarQube
├── run-sonar-scan.bat         # Script para análisis SonarQube
├── start.bat                  # Script de inicio completo
└── README.md
```

## 🌐 URLs de la Aplicación

- **Frontend**: http://localhost:8080 o abrir `frontend/index.html`
- **Backend API**: http://localhost:3000
- **SonarQube**: http://localhost:9000
- **Endpoints de la API**:
  - `GET /zones` - Listar zonas de estacionamiento
  - `GET /spaces` - Listar espacios de estacionamiento
  - `POST /zones` - Crear nueva zona
  - `POST /spaces` - Crear nuevo espacio
  - `PUT /zones/:id` - Actualizar zona
  - `PUT /spaces/:id` - Actualizar espacio
  - `DELETE /zones/:id` - Eliminar zona
  - `DELETE /spaces/:id` - Eliminar espacio

## ⚠️ Notas Importantes

- El puerto de PostgreSQL es **5433** (no 5432) para evitar conflictos con instalaciones locales
- Asegúrate de que **Docker Desktop** esté ejecutándose antes de iniciar
- El **backend debe estar corriendo** para que el frontend funcione correctamente
- Las credenciales de la base de datos están en `backend/config/db.js`

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | findstr parking-postgres

# Reiniciar el contenedor
docker restart parking-postgres

# Ver logs de errores
docker logs parking-postgres
```

### Puerto 3000 ya en uso
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número del proceso)
taskkill /PID <PID> /F

# O cambiar el puerto en backend/server.js
```

### Error "la autentificación password falló"
Esto indica que hay conflicto con PostgreSQL local. Usa el puerto 5433:
```javascript
// En backend/config/db.js
port: 5433  // No 5432
```

### Frontend no se conecta al backend
1. Verifica que el backend esté corriendo: http://localhost:3000/zones
2. Revisa la consola del navegador (F12) para errores CORS
3. Asegúrate de que el frontend apunte a `http://localhost:3000`

## 📝 Para Desarrolladores

### Agregar nuevas dependencias
```bash
cd backend
npm install nombre-paquete --save
```

### Modificar la base de datos
1. Edita `backend/sql/tablas.sql` para cambios de esquema
2. Edita `backend/sql/carga_inicial.sql` para datos iniciales
3. Recrear la base de datos:
```bash
docker rm -f parking-postgres
# Luego sigue los pasos de instalación
```

## 📝 Licencia

Este proyecto es solo para fines educativos y demostraciones de seguridad.
