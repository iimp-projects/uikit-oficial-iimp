# @nrivera-iimp/adopt

CLI oficial para incorporar las reglas de ingeniería IIMP en un proyecto Next.js existente sin copiar el boilerplate sobre su código.

> **Estado de distribución:** publicado en npm como [`@nrivera-iimp/adopt`](https://www.npmjs.com/package/@nrivera-iimp/adopt).

## Antes de ejecutar: qué elegir

- **Proyecto nuevo:** no uses este CLI; crea el [starter oficial](https://github.com/iimp-projects/uikit-oficial-iimp/tree/main/templates/next-starter).
- **Proyecto Next.js existente:** usa este CLI primero con `--dry-run` y revisa su reporte.
- **Solo quieres componentes:** instala [`official-uikit-iimp`](https://www.npmjs.com/package/official-uikit-iimp) sin ejecutar una migración.

La explicación completa, reglas y código fuente viven en el [repositorio oficial](https://github.com/iimp-projects/uikit-oficial-iimp) y en la [guía de bootstrap y adopción](https://github.com/iimp-projects/uikit-oficial-iimp/blob/main/docs/16_PROJECT_BOOTSTRAP.md).

## Ejecutar desde este repositorio

Para desarrollar o probar el CLI desde la raíz de este repositorio:

```bash
npm install
node packages/adopt/bin/iimp-adopt.mjs --dry-run --cwd /ruta/a/tu-proyecto
```

La interfaz pública se ejecuta con `npx`.

## Requisitos

- Node.js 20.9 o superior.
- Un proyecto con `package.json`.
- Git limpio o una rama dedicada antes de aplicar cambios.

## Analizar sin modificar

```bash
npx @nrivera-iimp/adopt@latest --dry-run
```

El comando detecta stack, package manager, configuración, skills faltantes y controles HTML que deberían migrarse al UI Kit. El dry-run no escribe archivos ni instala dependencias.

## Aplicar

```bash
npx @nrivera-iimp/adopt@latest
```

Antes de escribir muestra el plan y solicita confirmación. Para CI o ejecución deliberadamente no interactiva:

```bash
npx @nrivera-iimp/adopt@latest --yes
```

## Cambios realizados

- Instala `official-uikit-iimp`.
- Instala TypeScript, ESLint, Prettier, Tailwind v4, Vitest y Playwright.
- Conserva la versión mayor de Next.js existente salvo que se use `--upgrade-next`.
- Activa la configuración TypeScript strict del UI Kit.
- Compone la configuración ESLint existente con el estándar IIMP.
- Conserva la configuración ESLint previa como `eslint.config.pre-iimp.*`.
- Agrega scripts `lint`, `typecheck`, `format:check` y `check`.
- Conecta Tailwind y los tokens semánticos en el CSS global.
- Agrega reglas institucionales a `AGENTS.md` mediante un bloque administrado.
- Agrega `.github/workflows/iimp-quality.yml`.
- Genera `.iimp/ADOPTION_REPORT.md`.
- Crea `bitacora.md`, `scripts/append-bitacora.mjs`, y enlaza la regla desde `AGENTS.md`, `CLAUDE.md` y `GEMINI.md`.
- Puede convertir controles HTML inequívocos mediante `--fix-safe`.
- Instala solamente las skills base que falten.
- Ejecuta búsquedas de `find-skills`, consolida resultados y permite elegir todas, algunas o ninguna.

## Skills

La instalación es idempotente. Se busca cada skill en:

```text
.agents/skills
.codex/skills
.claude/skills
.gemini/skills
```

Si una skill ya existe, se conserva. No se actualiza ni sobrescribe silenciosamente.

Para instalar una skill nueva, el CLI delega en `npx skills add --agent claude-code codex gemini-cli --copy`. Solo se crean los directorios de esos agentes (`.agents/skills` y `.claude/skills`); no se generan carpetas para los más de 50 agentes que soporta `skills`.

## Bitácora

Al aplicar la adopción completa, se crea `bitacora.md` y una entrada inicial con la fecha/hora America/Lima. Antes de cada tarea, Codex, Claude y Gemini deben leerla; después de cada avance relevante, se registra el cambio y la validación sin borrar entradas previas:

```bash
npm run bitacora -- "Se corrigió el flujo de aprobación y npm run check pasó."
```

El script se crea solo si todavía no existe, para no reemplazar una implementación propia.

Instalar/revisar solo skills:

```bash
npx @nrivera-iimp/adopt@latest --skills-only
```

Omitir skills completamente:

```bash
npx @nrivera-iimp/adopt@latest --skip-skills
```

Volver a analizar recomendaciones:

```bash
npx @nrivera-iimp/adopt@latest --skills-only --recommend-skills
```

`find-skills` se instala al final del baseline. Las recomendaciones se generan desde las dependencias del `package.json` (Next, React, Tailwind, Zod, Vitest, Prisma, Supabase, AWS, Terraform, etc.). Solo se ofrecen skills cuyo nombre corresponde a una tecnología detectada y se descartan las de otros stacks (Expo, Cloudflare, Clerk si no se usa, etc.); no se hacen búsquedas genéricas. Nunca se instala nada sin elegirlo.

## Next.js

Por seguridad, `@nrivera-iimp/adopt` no realiza una actualización mayor de Next.js de manera implícita. Para solicitarla explícitamente:

```bash
npx @nrivera-iimp/adopt@latest --upgrade-next
```

Después revisa los cambios oficiales de migración y ejecuta:

```bash
npm run check
```

## Migración de HTML

El reporte identifica controles nativos, pero el CLI no reescribe automáticamente componentes complejos. Conversiones como `button → Button` pueden ser mecánicas; dialogs, formularios, tablas y elementos con lógica de teclado requieren revisión humana.

Para aplicar exclusivamente conversiones conservadoras (`button`, inputs compatibles, `label`, `textarea` y `hr`):

```bash
npx @nrivera-iimp/adopt@latest --fix-safe
```

Checkbox, radio, range, selects, tablas y dialogs se dejan para revisión explícita.

Etiquetas semánticas estructurales como `main`, `section`, `nav`, `header`, `footer` y `article` se conservan.

## Opciones

```text
--dry-run              analiza sin modificar
--yes, -y              aplica sin confirmación
--cwd <ruta>           selecciona otro proyecto
--skills-only          instala/recomienda skills únicamente
--skip-skills          omite instalación de skills
--skip-deps            aplica archivos sin instalar dependencias
--fix-safe             convierte controles HTML inequívocos
--recommend-skills     habilita recomendaciones (default)
--no-recommend-skills  deshabilita recomendaciones
--upgrade-next         autoriza Next/React latest
--help                 muestra ayuda
```

## Reversión

Trabaja en una rama. Los archivos agregados pueden eliminarse y la configuración ESLint anterior queda preservada como `eslint.config.pre-iimp.*`. El CLI no ejecuta `git reset`, no borra código de negocio y no modifica rutas o lógica funcional.
