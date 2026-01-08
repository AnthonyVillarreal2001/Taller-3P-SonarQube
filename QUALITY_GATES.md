# Quality Gates Configuration for Parking Vulnerable App

## Definición de Reglas de Quality Gates

### 1. Seguridad del Código (Security)
- **Security Hotspots Reviewed**: 100% (todos los hotspots revisados)
- **Security Rating**: A (sin vulnerabilidades)
- **Vulnerabilities**: 0 (cero vulnerabilidades nuevas)
- **Security Hotspots**: 0 (cero hotspots nuevos sin revisar)

### 2. Calidad del Diseño (Design Quality)
- **Code Smells**: < 50 (máximo 50 code smells nuevos)
- **Technical Debt Ratio**: < 5% (ratio de deuda técnica menor al 5%)
- **Duplicated Lines**: < 3% (menos del 3% de líneas duplicadas)
- **Cognitive Complexity**: Métodos con complejidad > 15 = 0

### 3. Mantenibilidad (Maintainability)
- **Maintainability Rating**: A (mantenibilidad excelente)
- **Code Coverage**: > 80% (cobertura de código mayor al 80%)
- **Lines of Code**: Monitorear crecimiento
- **Blocker Issues**: 0 (cero issues bloqueantes)
- **Critical Issues**: 0 (cero issues críticos)

### 4. Confiabilidad (Reliability)
- **Reliability Rating**: A (sin bugs)
- **Bugs**: 0 (cero bugs nuevos)

## Umbrales Recomendados para Nuevo Código (New Code)

| Métrica | Operador | Valor | Categoría |
|---------|----------|-------|-----------|
| Security Rating | is worse than | A | Seguridad |
| Reliability Rating | is worse than | A | Confiabilidad |
| Maintainability Rating | is worse than | A | Mantenibilidad |
| Coverage | is less than | 80% | Calidad |
| Duplicated Lines (%) | is greater than | 3% | Diseño |
| Security Hotspots Reviewed | is less than | 100% | Seguridad |
| New Vulnerabilities | is greater than | 0 | Seguridad |
| New Bugs | is greater than | 0 | Confiabilidad |
| New Code Smells | is greater than | 50 | Mantenibilidad |

## Instrucciones de Configuración

### Opción 1: Configuración Manual en la Interfaz Web

1. Accede a SonarQube: http://localhost:9000
2. Ve a **Quality Gates** en el menú principal
3. Clic en **Create**
4. Nombre: `Parking-Security-Quality-Gate`
5. Agrega las siguientes condiciones:

**Para Overall Code:**
- Coverage on New Code < 80%
- Duplicated Lines (%) on New Code > 3%

**Para New Code:**
- Security Rating on New Code worse than A
- Reliability Rating on New Code worse than A
- Maintainability Rating on New Code worse than A
- Security Hotspots Reviewed on New Code < 100%
- New Vulnerabilities > 0
- New Bugs > 0
- New Code Smells > 50

6. Asocia el Quality Gate al proyecto:
   - Ve a tu proyecto `parking-vulnerable-app`
   - Pestaña **Project Settings** → **Quality Gate**
   - Selecciona `Parking-Security-Quality-Gate`

### Opción 2: Configuración vía API (ver script PowerShell)

Ejecuta el script `configure-quality-gate.ps1` que se incluye en este repositorio.

## Verificación

Después de configurar, ejecuta un nuevo análisis:
```bash
.\run-sonar-scan.bat
```

El Quality Gate aparecerá en el dashboard del proyecto mostrando si pasa o falla.

## Interpretación de Resultados

- **PASSED (Verde)**: El código cumple todos los criterios de calidad
- **FAILED (Rojo)**: El código no cumple uno o más criterios
- **WARNING (Amarillo)**: El código está cerca de fallar algún criterio

## Referencias

- [SonarQube Quality Gates Documentation](https://docs.sonarqube.org/latest/user-guide/quality-gates/)
- [Metric Definitions](https://docs.sonarqube.org/latest/user-guide/metric-definitions/)
