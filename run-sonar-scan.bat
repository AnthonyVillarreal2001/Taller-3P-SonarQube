@echo off
echo ========================================
echo   SonarQube - Analisis de Codigo
echo ========================================
echo.
echo IMPORTANTE: Antes de ejecutar este script:
echo 1. Asegurate de que SonarQube este corriendo en http://localhost:9000
echo 2. Crea el proyecto en SonarQube con key: parking-vulnerable-app
echo 3. Genera un token de analisis
echo 4. Reemplaza TU_TOKEN_AQUI con tu token en este archivo
echo.
echo Presiona cualquier tecla para continuar o Ctrl+C para cancelar...
pause >nul
echo.
echo Ejecutando analisis de SonarQube...
echo.

REM IMPORTANTE: Reemplaza TU_TOKEN_AQUI con tu token de SonarQube
docker run --rm ^
  -e SONAR_HOST_URL="http://host.docker.internal:9000" ^
  -e SONAR_TOKEN="sqp_8b12fe966f32cf6060f20dff10d2f553ef021486" ^
  -v "%CD%:/usr/src" ^
  sonarsource/sonar-scanner-cli

echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo   ANALISIS COMPLETADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Revisa los resultados en:
    echo http://localhost:9000/dashboard?id=parking-vulnerable-app
) else (
    echo ========================================
    echo   ERROR EN EL ANALISIS
    echo ========================================
    echo.
    echo Verifica:
    echo - SonarQube este corriendo
    echo - El token sea valido
    echo - El proyecto este creado en SonarQube
)
echo.
pause

