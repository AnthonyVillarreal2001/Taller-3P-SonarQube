# Configuración Manual de Quality Gates en SonarQube

## Paso a Paso para Configurar Quality Gates

### 1. Acceder a SonarQube
- Abre tu navegador y ve a: http://localhost:9000
- Inicia sesión con tu cuenta de administrador

### 2. Crear un Nuevo Quality Gate

1. En el menú principal, haz clic en **Quality Gates**
2. Haz clic en el botón **Create** (arriba a la derecha)
3. Nombre: `Parking-Security-Quality-Gate`
4. Haz clic en **Create**

### 3. Agregar Condiciones de Seguridad

Haz clic en **Add Condition** y agrega las siguientes:

#### SEGURIDAD (Security)
1. **Security Rating on New Code**
   - Operador: `is worse than`
   - Valor: `A`

2. **New Vulnerabilities**
   - Operador: `is greater than`
   - Valor: `0`

3. **Security Hotspots Reviewed on New Code**
   - Operador: `is less than`
   - Valor: `100`

#### CONFIABILIDAD (Reliability)
4. **Reliability Rating on New Code**
   - Operador: `is worse than`
   - Valor: `A`

5. **New Bugs**
   - Operador: `is greater than`
   - Valor: `0`

#### MANTENIBILIDAD (Maintainability)
6. **Maintainability Rating on New Code**
   - Operador: `is worse than`
   - Valor: `A`

7. **New Code Smells**
   - Operador: `is greater than`
   - Valor: `50`

#### CALIDAD DEL CÓDIGO
8. **Coverage on New Code**
   - Operador: `is less than`
   - Valor: `80`

9. **Duplicated Lines (%) on New Code**
   - Operador: `is greater than`
   - Valor: `3`

#### CRITICIDAD
10. **Blocker Issues**
    - Operador: `is greater than`
    - Valor: `0`

11. **Critical Issues**
    - Operador: `is greater than`
    - Valor: `0`

### 4. Asociar el Quality Gate al Proyecto

1. Ve a tu proyecto: **Projects** → **parking-vulnerable-app**
2. Haz clic en **Project Settings** (configuración del proyecto)
3. Selecciona **Quality Gate** en el menú lateral
4. Selecciona `Parking-Security-Quality-Gate` de la lista
5. Guarda los cambios

### 5. Verificar la Configuración

1. Vuelve a **Quality Gates** en el menú principal
2. Selecciona `Parking-Security-Quality-Gate`
3. Verifica que todas las 11 condiciones estén configuradas correctamente

## Siguiente Paso: Ejecutar Análisis

Una vez configurado el Quality Gate, ejecuta el análisis:

```bash
.\run-sonar-scan.bat
```

O manualmente:

```bash
docker run --rm -e SONAR_HOST_URL="http://host.docker.internal:9000" -e SONAR_TOKEN="sqp_8b12fe966f32cf6060f20dff10d2f553ef021486" -v "%CD%:/usr/src" sonarsource/sonar-scanner-cli
```

## Interpretar Resultados

Después del análisis, verás en el dashboard:

- **✅ PASSED (Verde)**: El código cumple todos los criterios
- **❌ FAILED (Rojo)**: El código no cumple uno o más criterios

Haz clic en el Quality Gate para ver qué condiciones fallaron.

## Resumen de Quality Gates Configurados

| Categoría | Métrica | Umbral |
|-----------|---------|--------|
| **Seguridad** | Security Rating | A |
| **Seguridad** | Vulnerabilities | 0 |
| **Seguridad** | Security Hotspots Reviewed | 100% |
| **Confiabilidad** | Reliability Rating | A |
| **Confiabilidad** | Bugs | 0 |
| **Mantenibilidad** | Maintainability Rating | A |
| **Mantenibilidad** | Code Smells | ≤ 50 |
| **Cobertura** | Coverage | ≥ 80% |
| **Duplicación** | Duplicated Lines | ≤ 3% |
| **Criticidad** | Blocker Issues | 0 |
| **Criticidad** | Critical Issues | 0 |

Estas reglas están enfocadas en:
- ✅ **Seguridad**: Sin vulnerabilidades ni hotspots sin revisar
- ✅ **Calidad del diseño**: Mínima duplicación, buena cobertura
- ✅ **Mantenibilidad**: Código limpio, pocos code smells
