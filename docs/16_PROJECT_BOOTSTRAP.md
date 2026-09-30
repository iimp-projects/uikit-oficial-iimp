# Bootstrap y adopción de proyectos IIMP

## Objetivo

Todos los proyectos nuevos parten de una base Next.js reproducible. Los proyectos existentes adoptan el mismo contrato mediante un CLI que analiza antes de escribir.

## Artefactos

### `official-uikit-iimp`

Paquete npm que contiene componentes, tokens, layouts y las configuraciones compartidas:

```text
official-uikit-iimp/eslint/next-strict
official-uikit-iimp/tsconfig/next-strict.json
```

### `templates/next-starter`

Boilerplate para proyectos nuevos. Se crea con `create-next-app --example`, por lo que cada aplicación recibe archivos propios que no serán sobrescritos al actualizar el UI Kit.

### `@iimp/adopt`

CLI npm para proyectos existentes. Analiza, instala dependencias, conecta el estándar, agrega skills faltantes y produce un reporte de migración.

## Proyecto nuevo

```bash
npx create-next-app@latest \
  --example "https://github.com/iimp-projects/uikit-oficial-iimp" \
  --example-path templates/next-starter \
  mi-proyecto

cd mi-proyecto
npm run setup
npm run check
```

## Proyecto existente

```bash
npx @iimp/adopt@latest --dry-run
npx @iimp/adopt@latest
npm run check
```

La conversión automática conservadora se solicita con `--fix-safe`; controles complejos permanecen en el reporte para migración manual.

## Zero errors

El estándar exige:

- TypeScript strict y opciones adicionales para índices, opcionales y retornos;
- ESLint type-aware, Core Web Vitals y guardrails IIMP;
- `--max-warnings=0`;
- formato verificado;
- pruebas y build de producción;
- CI bloqueando cambios que fallen.

No se reduce la severidad para hacer pasar un proyecto legacy. Los hallazgos se corrigen progresivamente y quedan visibles en `.iimp/ADOPTION_REPORT.md`.

## Política de actualización

- El starter utiliza versiones exactas aprobadas.
- Dependabot/Renovate propone actualizaciones mediante PR.
- Next.js mayor se actualiza primero en el starter y se valida.
- El UI Kit sigue SemVer.
- Las aplicaciones no editan `node_modules`.
- Props, children y lógica de la aplicación no se sobrescriben al actualizar el paquete.

## Seguridad

- Tratar skills como dependencias ejecutables: origen visible, instalación explícita y sin reemplazos silenciosos.
- Tratar Server Actions y Route Handlers como endpoints públicos.
- Validar input externo en runtime.
- Autorizar cada operación protegida en el servidor.
- Mantener secretos fuera del cliente y de logs.
- Usar headers defensivos, límites de request y rate limiting según el despliegue.
