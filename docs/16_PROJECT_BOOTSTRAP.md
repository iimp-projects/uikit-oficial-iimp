# Bootstrap y adopción de proyectos IIMP

## Objetivo

Todos los proyectos nuevos parten de una base Next.js reproducible. Los proyectos existentes adoptan el mismo contrato mediante un CLI que analiza antes de escribir.

## Artefactos

| Artefacto | Función | Estado actual | README |
| --- | --- | --- | --- |
| `official-uikit-iimp` | Paquete npm de UI, tokens y configuración strict. | Publicado (`0.8.1`). | [README raíz](../README.md) |
| `templates/next-starter` | Boilerplate para aplicaciones Next.js nuevas. | Parte de este repositorio. | [README del starter](../templates/next-starter/README.md) |
| `@iimp/adopt` | CLI de adopción para aplicaciones existentes. | Source y pruebas listos; publicación npm pendiente del scope `@iimp`. | [README del CLI](../packages/adopt/README.md) |

No son tres shells visuales. `AuthLayout` y `DashboardLayout` son patterns del primer artefacto; el starter y el CLI son mecanismos de distribución/adopción.

### `official-uikit-iimp`

Paquete npm que contiene componentes, tokens, layouts y las configuraciones compartidas:

```text
official-uikit-iimp/eslint/next-strict
official-uikit-iimp/tsconfig/next-strict.json
```

### `templates/next-starter`

Boilerplate para proyectos nuevos. Se crea con `create-next-app --example`, por lo que cada aplicación recibe archivos propios que no serán sobrescritos al actualizar el UI Kit.

### `@iimp/adopt`

CLI para proyectos existentes. Analiza, instala dependencias, conecta el estándar, agrega skills faltantes y produce un reporte de migración. La versión bajo `@iimp` todavía no está publicada, por lo que se ejecuta localmente desde este checkout hasta completar la configuración del scope npm.

## Proyecto nuevo

Requisito: Node.js 22.22.2 o superior.

```bash
npx create-next-app@latest \
  --example "https://github.com/iimp-projects/uikit-oficial-iimp" \
  --example-path templates/next-starter \
  mi-proyecto

cd mi-proyecto
npm run setup
npm run check
```

El flujo de instalación pública queda completo cuando `@iimp/adopt` sea publicado. Antes de ello, valida el starter dentro de este repositorio con `npm run test:starter`.

## Proyecto existente

Desde este checkout:

```bash
node packages/adopt/bin/iimp-adopt.mjs --dry-run --cwd /ruta/a/tu-proyecto
node packages/adopt/bin/iimp-adopt.mjs --cwd /ruta/a/tu-proyecto
```

Cuando el paquete sea publicado bajo `@iimp`, la misma interfaz será:

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

## Versión pública de la aplicación

El starter incluye `NEXT_PUBLIC_APP_VERSION=v0.0.1` en `.env.example` y expone `appVersion` desde `src/lib/project.ts`. Si no existe una variable de entorno, usa la versión de `package.json`. Pásala a `DashboardVersion` dentro del slot `DashboardHeader.status`.

Las entregas usan los scripts `npm run release:patch`, `npm run release:minor` o `npm run release:major`. `npm version` mantiene la correlación entre `package.json` y `.env.example`; `npm run check` falla si no coinciden. No se incrementa el número por cada guardado o commit.

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
