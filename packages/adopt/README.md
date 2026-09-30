# @iimp/adopt

CLI oficial para incorporar las reglas de ingeniería IIMP en un proyecto Next.js existente sin copiar el boilerplate sobre su código.

## Requisitos

- Node.js 20.9 o superior.
- Un proyecto con `package.json`.
- Git limpio o una rama dedicada antes de aplicar cambios.

## Analizar sin modificar

```bash
npx @iimp/adopt@latest --dry-run
```

El comando detecta stack, package manager, configuración, skills faltantes y controles HTML que deberían migrarse al UI Kit. El dry-run no escribe archivos ni instala dependencias.

## Aplicar

```bash
npx @iimp/adopt@latest
```

Antes de escribir muestra el plan y solicita confirmación. Para CI o ejecución deliberadamente no interactiva:

```bash
npx @iimp/adopt@latest --yes
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
- Puede convertir controles HTML inequívocos mediante `--fix-safe`.
- Instala solamente las skills base que falten.
- Ejecuta búsquedas de `find-skills`, consolida resultados y permite elegir todas, algunas o ninguna.

## Skills

La instalación es idempotente. Se busca cada skill en:

```text
.agents/skills
.codex/skills
.claude/skills
```

Si una skill ya existe, se conserva. No se actualiza ni sobrescribe silenciosamente.

Instalar/revisar solo skills:

```bash
npx @iimp/adopt@latest --skills-only
```

Omitir skills completamente:

```bash
npx @iimp/adopt@latest --skip-skills
```

Volver a analizar recomendaciones:

```bash
npx @iimp/adopt@latest --skills-only --recommend-skills
```

`find-skills` se instala al final del baseline. Las recomendaciones se generan desde dependencias y archivos detectados —por ejemplo Prisma, PostgreSQL, AWS o Terraform—; el usuario no tiene que escoger categorías previamente.

## Next.js

Por seguridad, `@iimp/adopt` no realiza una actualización mayor de Next.js de manera implícita. Para solicitarla explícitamente:

```bash
npx @iimp/adopt@latest --upgrade-next
```

Después revisa los cambios oficiales de migración y ejecuta:

```bash
npm run check
```

## Migración de HTML

El reporte identifica controles nativos, pero el CLI no reescribe automáticamente componentes complejos. Conversiones como `button → Button` pueden ser mecánicas; dialogs, formularios, tablas y elementos con lógica de teclado requieren revisión humana.

Para aplicar exclusivamente conversiones conservadoras (`button`, inputs compatibles, `label`, `textarea` y `hr`):

```bash
npx @iimp/adopt@latest --fix-safe
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
