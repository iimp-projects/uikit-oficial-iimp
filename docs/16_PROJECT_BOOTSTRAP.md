# Bootstrap y adopción de proyectos IIMP

Catálogo visual y guías: [Storybook publicado](https://uikit-oficial-iimp.vercel.app/).

## Objetivo

Todos los proyectos nuevos parten de una base Next.js reproducible. Los proyectos existentes adoptan el mismo contrato mediante un CLI que analiza antes de escribir.

## Artefactos

| Artefacto                                                                  | Función                                           | Estado actual               | README                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------- | --------------------------------------------------------- |
| [`official-uikit-iimp`](https://www.npmjs.com/package/official-uikit-iimp) | Paquete npm de UI, tokens y configuración strict. | Publicado (`0.9.3`).        | [README raíz](../README.md)                               |
| `templates/next-starter`                                                   | Boilerplate para aplicaciones Next.js nuevas.     | Parte de este repositorio.  | [README del starter](../templates/next-starter/README.md) |
| [`@nrivera-iimp/adopt`](https://www.npmjs.com/package/@nrivera-iimp/adopt) | CLI de adopción para aplicaciones existentes.     | Publicado en npm (`0.1.10`). | [README del CLI](../packages/adopt/README.md)             |

No son tres shells visuales. `AuthLayout` y `DashboardLayout` son patterns del primer artefacto; el starter y el CLI son mecanismos de distribución/adopción.

### `official-uikit-iimp`

Paquete npm que contiene componentes, tokens, layouts y las configuraciones compartidas:

```text
official-uikit-iimp/eslint/next-strict
official-uikit-iimp/tsconfig/next-strict.json
```

### `templates/next-starter`

Boilerplate para proyectos nuevos. Se crea con `create-next-app --example`, por lo que cada aplicación recibe archivos propios que no serán sobrescritos al actualizar el UI Kit.

### `@nrivera-iimp/adopt`

CLI para proyectos existentes. Analiza, instala dependencias, conecta el estándar, agrega skills faltantes y produce un reporte de migración. Se instala públicamente desde npm bajo el scope personal institucional `@nrivera-iimp`.

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

El flujo de instalación pública está completo. El starter se valida también dentro de este repositorio con `npm run test:starter`.

## Proyecto existente

Desde este checkout:

```bash
node packages/adopt/bin/iimp-adopt.mjs --dry-run --cwd /ruta/a/tu-proyecto
node packages/adopt/bin/iimp-adopt.mjs --cwd /ruta/a/tu-proyecto
```

La interfaz pública es:

```bash
npx @nrivera-iimp/adopt@latest --dry-run
npx @nrivera-iimp/adopt@latest
npm run check
```

La conversión automática conservadora se solicita con `--fix-safe`; controles complejos permanecen en el reporte para migración manual.

## Bitácora y contexto de agentes

El starter y la adopción completa crean una `bitacora.md` en la raíz. Es el registro cronológico compartido: antes de trabajar, Codex, Claude y Gemini leen ese archivo; al cerrar cada avance relevante, agregan fecha/hora America/Lima, el cambio y la validación realizada. No se borra ni se reescribe el historial.

```bash
npm run bitacora -- "Se añadió la validación de RUC; npm run check pasó."
```

La regla está disponible en `AGENTS.md` y se enlaza explícitamente desde `CLAUDE.md` y `GEMINI.md`. Las skills base se agregan con `skills add --agent claude-code codex gemini-cli --copy`: el instalador las deja disponibles para Claude, Codex y Gemini sin crear carpetas de otros agentes y detecta antes las rutas `.agents/skills`, `.codex/skills`, `.claude/skills` y `.gemini/skills` para no duplicar una skill ya instalada.

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
