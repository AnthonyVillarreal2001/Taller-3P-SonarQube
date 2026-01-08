@echo off
echo ========================================
echo   Parking Vulnerable App - Iniciador
echo ========================================
echo.

REM Verificar Docker
echo [1/6] Verificando Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta instalado o no esta corriendo
    echo Por favor, inicia Docker Desktop y vuelve a intentar
    pause
    exit /b 1
)
echo OK - Docker esta corriendo

REM Iniciar PostgreSQL con Docker Compose
echo.
echo [2/6] Iniciando PostgreSQL...
docker-compose up -d
echo Esperando 10 segundos para que PostgreSQL inicie...
timeout /t 10 /nobreak >nul

REM Crear tablas
echo.
echo [3/6] Creando tablas en la base de datos...
powershell -Command "Get-Content backend/sql/tablas.sql | docker exec -i parking-postgres psql -U postgres -d parking_db"

REM Cargar datos iniciales
echo.
echo [4/6] Cargando datos iniciales...
powershell -Command "Get-Content backend/sql/carga_inicial.sql | docker exec -i parking-postgres psql -U postgres -d parking_db"

REM Instalar dependencias del backend
echo.
echo [5/6] Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    cd ..
    pause
    exit /b 1
)
cd ..

REM Abrir el frontend
echo.
echo [6/6] Abriendo frontend...
start "" frontend\index.html

echo.
echo ========================================
echo   CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Frontend: Abierto en tu navegador
echo Backend: Iniciando en http://localhost:3000
echo PostgreSQL: Corriendo en puerto 5433
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

REM Iniciar el servidor backend
cd backend
npm start
