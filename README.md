# official-uikit-iimp

UI Kit oficial de Eventos IIMP. Basado en shadcn/ui y Tailwind CSS. Incluye **primitives** (Button, Input, Select, Dialog…) y **patterns** (FormField, DataTable, ConfirmDialog…) ya alineados con los tokens, la accesibilidad (targets de 44px) y el theming de IIMP.

> Regla principal: las apps **componen** con este kit. No crean un sistema visual paralelo ni usan `<button>`, `<input>`, `<select>` o `<textarea>` nativos.

## El armazón: login + dashboard ya hechos

Un proyecto nuevo arranca con **dos pantallas listas**: el **login** (`/`) y el **dashboard** (`/dashboard`) con sidebar, header y un `main` vacío. Tú solo pones el menú y el contenido.

```text
/            → Login  (LoginScreen)
/dashboard   → Armazón (AppShell): sidebar + header + main vacío
```

**Qué cambias (3 archivos en `src/`):**

| Quieres…                                     | Edita                           |
| -------------------------------------------- | ------------------------------- |
| Nombre, tagline y versión del sistema        | `src/config/app.ts`             |
| El menú del sidebar (grupos, íconos, badges) | `src/config/navigation.tsx`     |
| Textos del login y conectar tu autenticación | `src/components/login-form.tsx` |
| Contenido de cada vista                      | `src/app/(app)/<ruta>/page.tsx` |

**Qué NO tocas:** el sidebar, el header (breadcrumb, idioma, notificaciones), el usuario con cierre de sesión, el estado activo del menú y el responsive. Viene en `AppShell`.

**Agregar una vista nueva** (ejemplo `/procesamientos`):

1. Crea `src/app/(app)/procesamientos/page.tsx` con tu contenido.
2. Añade el ítem en `src/config/navigation.tsx`:

```tsx
{ title: "Procesamientos", href: "/procesamientos", icon: <FilesIcon /> }
```

El ítem activo, el breadcrumb y el menú móvil se actualizan solos.

**Conectar tu autenticación:** el login (`handleSignIn`) y el cierre de sesión (`src/lib/auth-actions.ts`) son _placeholders_. Reemplázalos por tu proveedor (NextAuth, Server Action, Google Workspace…). El kit no hace autenticación.

Ver el armazón en Storybook: **Armazón → Login** y **Armazón → Dashboard** (`npm run storybook`).

## Empieza aquí: instalación según tu caso

Hay **tres paquetes** que se complementan. No necesitas copiar archivos de este repositorio.

| Paquete / pieza                                | Para qué sirve                                                                                | Se instala con                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `official-uikit-iimp` (UI Kit)                 | Componentes, tokens, patterns, reglas ESLint y TypeScript strict.                             | `npm install official-uikit-iimp`        |
| `@nrivera-iimp/adopt` (CLI de adopción)        | Aplica el estándar completo a un proyecto Next.js **que ya existe** (scripts, ESLint, gate…). | `npx @nrivera-iimp/adopt@latest`         |
| Starter (boilerplate `templates/next-starter`) | Proyecto Next.js **nuevo** con login, dashboard, CI y todo lo anterior ya configurado.        | `npx create-next-app@latest --example …` |

**Requisitos comunes:** Node.js 22 o superior (el starter exige 22.22.2+; el CLI funciona desde 20.9), npm 10+, Git. React 19 y Next.js (App Router) para el starter/adopt. Para la auditoría de seguridad: [Claude Code](https://claude.com/claude-code) instalado y con sesión iniciada (`claude --version`).

### Caso A — Proyecto nuevo (recomendado)

```bash
# 1. Crear el proyecto desde el starter
npx create-next-app@latest \
  --example "https://github.com/iimp-projects/uikit-oficial-iimp" \
  --example-path templates/next-starter \
  mi-proyecto
cd mi-proyecto

# 2. Una sola vez: instala las skills de agentes (incluida security-audit)
npm run setup

# 3. Verifica que todo está sano (en un proyecto recién creado el gate de seguridad aún no tiene auditoría)
IIMP_SECURITY_GATE=skip npm run check

# 4. Trabaja
npm run dev
```

Qué recibes: login (`/`) y dashboard (`/dashboard`) listos, TypeScript estricto, ESLint con las reglas del kit, tests, CI, bitácora y el gate de seguridad. Detalle de qué editar en [El armazón](#el-armazón-login--dashboard-ya-hechos).

### Caso B — Ya tengo un proyecto Next.js y quiero adoptar el estándar

Trabaja siempre en una rama limpia para poder revertir:

```bash
cd mi-proyecto-existente
git checkout -b chore/adoptar-estandar-iimp

# 1. Analiza SIN modificar nada (lee el reporte que imprime)
npx @nrivera-iimp/adopt@latest --dry-run

# 2. Aplica (pide confirmación antes de escribir)
npx @nrivera-iimp/adopt@latest

# 3. Limpia caché y valida
rm -rf .next
npm run check
```

Opciones del CLI:

| Opción                                         | Qué hace                                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `--dry-run`                                    | Analiza e imprime el plan; no escribe archivos ni instala nada.                                                      |
| `--yes`                                        | Aplica sin preguntar (CI o ejecución no interactiva).                                                                |
| `--cwd <ruta>`                                 | Proyecto a analizar (por defecto el directorio actual).                                                              |
| `--fix-safe`                                   | Convierte controles HTML inequívocos (`<button>`, `<input>`, `<label>`, `<hr>`, `<textarea>`) a componentes del kit. |
| `--skills-only`                                | Solo instala las skills; no toca la configuración.                                                                   |
| `--skip-skills` / `--skip-deps`                | No instala skills base / no instala dependencias npm.                                                                |
| `--recommend-skills` / `--no-recommend-skills` | Busca (u omite) recomendaciones de skills al terminar.                                                               |
| `--upgrade-next`                               | Actualiza Next/React de forma explícita (por defecto conserva tu versión mayor).                                     |

Qué cambia en tu proyecto: instala `official-uikit-iimp` y las herramientas de calidad (TypeScript, ESLint, Prettier, Tailwind v4, Vitest, Playwright); activa `tsconfig` strict; compone tu ESLint con el estándar (guarda el anterior como `eslint.config.pre-iimp.*`); agrega los scripts `lint`, `typecheck`, `format:check`, `check`, `prebuild`, `predev`, `security:audit`, `security:verify`, `security:import`; copia `scripts/security-gate.mjs`; crea `bitacora.md`, `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`, el workflow de CI y `.iimp/ADOPTION_REPORT.md`; instala las skills base.

**Después de adoptar (checklist):**

1. `npm run check`. Aparecerán errores nuevos de ESLint: son esperados y señalan lo que migrar (botones solo icono sin `aria-label`, botones seguidos sin `ButtonGroup`, campos en `grid-cols-N`, descripciones sueltas, filtros apilados…). Cada mensaje dice qué componente usar.
2. Migra formularios a `FormGrid` + `FormField` y filtros a `FilterBar` (ver [Reglas obligatorias](#reglas-obligatorias-del-kit)).
3. Corre la auditoría de seguridad (siguiente sección) hasta que el build deje de bloquear.
4. Haz commit de `.security/` y `.agents/skills/security-audit`.

### Caso C — Solo quiero los componentes en una app existente (sin adopt)

```bash
npm install official-uikit-iimp
```

Importa los estilos **una sola vez** en la raíz (`import "official-uikit-iimp/style.css"`) y usa los componentes. Con Next.js, Vite y Tailwind v4 mira las secciones de [Instalación](#1-instalación) más abajo. Opcionalmente activa las reglas: `import { iimpGuardrails } from "official-uikit-iimp/eslint"` ([Guardrails de ESLint](#6-guardrails-de-eslint-recomendado)).

### Caso D — Actualizar el kit en un proyecto que ya lo usa

```bash
git checkout -b chore/uikit-ultima-version
npm install official-uikit-iimp@latest --save-exact
npx @nrivera-iimp/adopt@latest      # trae scripts y reglas nuevas del estándar
rm -rf .next
npm run check
```

Actualizar el paquete solo reemplaza `node_modules`; no modifica tus archivos. Las reglas nuevas pueden hacer fallar `lint` hasta que migres (es lo esperado). Cambios por versión: [Actualizar una aplicación existente](#actualizar-una-aplicación-existente).

Este repositorio es la fuente de verdad: [código, documentación y starter en GitHub](https://github.com/iimp-projects/uikit-oficial-iimp).

## Guía de punta a punta: del proyecto nuevo al deploy

Esta es la ruta completa con el boilerplate (starter). Cada comando dice **qué hace** y **qué bloquea**.

```bash
# 1. Crear el proyecto
npx create-next-app@latest --example "https://github.com/iimp-projects/uikit-oficial-iimp" --example-path templates/next-starter mi-proyecto
cd mi-proyecto

# 2. Una sola vez: instala las skills de agentes (incluida security-audit)
npm run setup

# 3. Desarrollar (no bloquea; avisa si falta la auditoría de seguridad)
npm run dev

# 4. Antes de compilar o desplegar: auditoría de seguridad y corrección de hallazgos
npm run security:audit

# 5. Validación completa y deploy
npm run check      # formato, versión, typecheck, lint, tests, build
npm run build      # lo que corre Vercel/CI al desplegar
```

| Comando                                | Qué hace                                                                                                              | ¿Bloquea?                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `npm run setup`                        | Instala las skills base que falten (caveman, TDD, Playwright, shadcn, `security-audit`…). Idempotente.                | No                                                        |
| `npm run dev`                          | Servidor de desarrollo. Antes corre `predev`: imprime un aviso si la auditoría falta, está vencida o tiene hallazgos. | **No**: solo avisa, para no frenar el trabajo diario      |
| `npm run security:audit`               | Lanza la skill `security-audit` con un agente sin interfaz (`claude -p`), guarda la evidencia en `.security/`.        | Es el paso explícito; consume tokens de tu cuenta         |
| `npm run security:import -- <run-dir>` | Registra en `.security/` una auditoría hecha a mano en Claude Code (alternativa a `security:audit`).                  | No                                                        |
| `npm run security:verify`              | Verifica la evidencia sin IA (determinista, segundos).                                                                | Sí: sale con error si algo falla                          |
| `npm run build`                        | Antes corre `prebuild` = `typecheck` + `lint` + `security:verify`; después `next build`.                              | **Sí**: no compila con errores de tipos, lint o seguridad |
| `npm run check`                        | Quality gate completo (el mismo que corre el CI).                                                                     | Sí                                                        |
| `npm run bitacora -- ""`               | Agrega una entrada con fecha/hora a `bitacora.md`.                                                                    | No                                                        |

> **¿`security:audit` se ejecuta dentro de `npm run build`?** No. Son pasos separados: `npm run security:audit` es la auditoría (lenta, usa IA) y se corre a mano; `npm run build` solo ejecuta `security:verify`, que comprueba en segundos que la evidencia exista, esté limpia y corresponda al código actual. Si no es así, el build se detiene y te dice que corras la auditoría.

### Cómo correr la auditoría de seguridad, paso a paso

La auditoría usa la skill [`security-audit`](https://github.com/cloudflare/security-audit-skill) de Cloudflare: un agente de IA que revisa el código fuente, intenta refutar cada hallazgo con agentes independientes y escribe un reporte. Es **lenta y gasta tokens de tu cuenta**, por eso es un paso explícito y no parte de cada build.

**Requisitos:** (1) `npm run setup` ya ejecutado (instala la skill en `.agents/skills/security-audit`); (2) [Claude Code](https://claude.com/claude-code) instalado y con sesión iniciada (`claude --version` debe responder); (3) cambios de código ya guardados (cualquier cambio posterior invalida la auditoría).

```bash
# 1. Lanza la auditoría (puede tardar varios minutos)
npm run security:audit

# 2. Lee el reporte; cada hallazgo "confirmed" debe parcharse
cat .security/REPORT.md          # detalle en FINDINGS-DETAIL.md; pendientes en NEEDS-VALIDATION.md

# 3. Corrige el código y repite el paso 1 hasta ver:
#    "Security gate OK: auditoría vigente, sin hallazgos abiertos."

# 4. Versiona la evidencia (el CI y Vercel la necesitan para compilar)
git add .security .agents/skills/security-audit
git commit -m "chore: auditoría de seguridad vigente"
```

**¿Qué hace `npm run security:audit` por dentro?** Ejecuta `claude -p` con la instrucción de correr la skill en modo `standard`, deja su salida en `~/security-audit-skill/<proyecto>/run-N/` (fuera del repo), copia a `.security/` los archivos `findings.json`, `run-metadata.json`, `coverage-ledger.json`, `REPORT.md`, `FINDINGS-DETAIL.md` y `NEEDS-VALIDATION.md`, escribe `attestation.json` con un hash del código y verifica el resultado.

**Si el comando automático falla** (permisos, `claude` no encontrado, etc.), corre la skill a mano y registra el resultado:

```bash
# En Claude Code, dentro del proyecto, pide:
#   "Usa la skill security-audit en modo full audit, profile standard, sobre este repositorio."
# Cuando termine, toma la carpeta que indica (…/security-audit-skill/<proyecto>/run-N) y:
npm run security:import -- ~/security-audit-skill/mi-proyecto/run-1
```

También puedes reemplazar el comando del agente con `IIMP_SECURITY_AUDIT_CMD="mi-comando"` (debe imprimir `RUN_DIR=<ruta>`).

**Errores frecuentes:**

| Mensaje del gate                                          | Qué hacer                                                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `No hay auditoría de seguridad (.security/findings.json)` | Corre `npm run security:audit`.                                                                 |
| `El código cambió después de la última auditoría`         | Volviste a editar `src/`, `app/`, `pages/`, `next.config.*` o el lockfile: repite la auditoría. |
| `Vulnerabilidad confirmada sin parchar`                   | Corrige el código y repite; no se puede aceptar.                                                |
| `Hallazgo pendiente de validar`                           | Resuélvelo o regístralo en `.security/accepted.json` (ver más abajo).                           |
| `No está instalada la skill security-audit`               | Corre `npm run setup` y versiona `.agents/skills/security-audit`.                               |
| `La auditoría no terminó (run_status = incomplete)`       | La corrida se cortó: repítela.                                                                  |

### Seguridad: cuándo aparece la auditoría

| Momento                  | Qué pasa                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`            | Aviso en consola (no bloquea) con los motivos pendientes y el comando para corregirlos.                                                      |
| `npm run build` / deploy | **Bloquea** hasta que la auditoría esté vigente y limpia. Vercel y cualquier CI ejecutan `build`, así que no se puede desplegar sin auditar. |
| Pull request / `main`    | El workflow `IIMP Quality` corre `npm run check` con `IIMP_SECURITY_GATE_LOCK=1`, que impide saltarse el gate.                               |

Cómo se corrige: abre `.security/REPORT.md`, parcha cada hallazgo `confirmed`, vuelve a correr `npm run security:audit` hasta que el reporte quede limpio y haz commit de `.security/`. Reglas exactas:

- **Falla** si no existe `.security/findings.json`, si no pasa `validate-findings.cjs` de la skill, si `run_status` no es `complete`, si el código cambió después de auditar (hash de `src/`, `app/`, `pages/`, `next.config.*` y `package-lock.json`), si hay algún hallazgo `confirmed` o un `needs_validation` sin aceptar.
- Un `confirmed` **nunca** se acepta: se parcha y se vuelve a auditar.
- Un `needs_validation` solo se acepta en `.security/accepted.json`, con motivo y aprobador:

```json
[
  {
    "fingerprint": "idor-pedidos-2",
    "reason": "Requiere probar contra el entorno productivo; verificado por revisión manual.",
    "approvedBy": "ana.perez"
  }
]
```

- `IIMP_SECURITY_GATE=skip npm run build` omite el gate **solo en local** y lo avisa en voz alta. El CI lo anula con `IIMP_SECURITY_GATE_LOCK=1`.
- Versiona `.security/` y `.agents/skills/security-audit` (el validador vive ahí) para que el CI y Vercel puedan verificar.
- `IIMP_SECURITY_AUDIT_CMD="mi comando"` reemplaza el comando del agente (debe imprimir `RUN_DIR=<ruta>`).
- Límite honesto: es una revisión asistida por IA. Que no encuentre nada no prueba que no existan vulnerabilidades; complementa a `npm audit`, secret scanning y CodeQL, no los reemplaza.

## Mapa de artefactos y documentación

El estándar se distribuye en tres piezas complementarias; no son tres shells visuales:

| Artefacto                                                                                                        | Uso                                                              | Estado de distribución                                                 | Documentación                                            |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| [`official-uikit-iimp`](https://www.npmjs.com/package/official-uikit-iimp)                                       | Componentes, tokens, patterns y configuración strict compartida. | Publicado en npm (`0.9.2`).                                            | Este README                                              |
| [`templates/next-starter`](https://github.com/iimp-projects/uikit-oficial-iimp/tree/main/templates/next-starter) | Boilerplate Git para aplicaciones Next.js nuevas.                | Vive en este repositorio y se consume con `create-next-app --example`. | [README del starter](./templates/next-starter/README.md) |
| [`@nrivera-iimp/adopt`](https://www.npmjs.com/package/@nrivera-iimp/adopt)                                       | CLI para adoptar el estándar en una aplicación existente.        | Publicado en npm (`0.1.9`).                                            | [README del CLI](./packages/adopt/README.md)             |

La guía que conecta las tres piezas, sus límites y la ruta para proyectos nuevos o existentes está en [Bootstrap y adopción](https://github.com/iimp-projects/uikit-oficial-iimp/blob/main/docs/16_PROJECT_BOOTSTRAP.md). Las reglas visuales y técnicas viven en [`docs/`](./docs/).

## Reglas obligatorias del kit

Estas reglas ya vienen aplicadas por los componentes y, donde se puede, las exige ESLint con `--max-warnings=0`.

| Regla                                                                                                                                                                    | Dónde se aplica                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| **Cabeceras de tabla:** Manrope 600, 13px, MAYÚSCULAS, tracking amplio y color muted. No se sobrescriben en `<TableHead>`.                                               | `TableHead` (y `DataTable`); regla ESLint; e2e                       |
| **Logo del sidebar:** 35px de alto y ancho automático (`h-[35px] w-auto`), centrado en su recuadro.                                                                      | `DashboardSidebarBrand` / `AppShell`; e2e                            |
| **Botón solo icono:** `size="icon"` (`icon-sm`/`icon-lg`) + `aria-label`; si no es obvio, `Tooltip`. Con espacio, icono + texto.                                         | Regla `iimp/icon-button-label`                                       |
| **2 o más botones seguidos del mismo nivel:** van dentro de `<ButtonGroup>`. Excepciones: footers de dialog/card y Primary + otra variante.                              | Regla `iimp/prefer-button-group`                                     |
| **Pares de color:** todo `bg-secondary`/`bg-primary` lleva su `text-*-foreground`.                                                                                       | Componentes; test `close-button.test.tsx`                            |
| **Formularios con varios campos:** van dentro de `<FormGrid>` (columnas según el ancho real del contenedor, sin huecos). Nada de `grid-cols-N` a mano ni anchos `w-1/4`. | `FormGrid`; regla `iimp/form-grid`; e2e `form-grid.spec.ts`          |
| **Descripciones de campo:** van en la prop `description` de `<FormField>` (icono de ayuda `?`), nunca como un `<p>` o `FieldDescription` suelto junto al input.          | `FormField`; regla `iimp/field-description`; e2e `form-grid.spec.ts` |
| **Filtros:** buscador, selects y botón van en `<FilterBar>` (una fila que envuelve); nunca un control por fila ni estirados al 100 %.                                    | `FilterBar`; regla `iimp/filter-layout`; e2e `filter-bar.spec.ts`    |
| **Cero errores:** `strictTypeChecked`, sin `any`, promesas esperadas, `--max-warnings=0`; el build ejecuta `typecheck` + `lint` + `security:verify`.                     | `official-uikit-iimp/eslint/next-strict`, `prebuild`                 |
| **Seguridad:** auditoría vigente y sin hallazgos para compilar.                                                                                                          | `security:verify` en `prebuild`                                      |

Ejemplos:

```tsx
// Tabla: no pongas tipografía en la cabecera, ya es Manrope 600 / 13px / mayúsculas
<TableHead className="w-32 text-right">Monto</TableHead>   // ✅
<TableHead className="text-sm font-medium">Monto</TableHead> // ❌ ESLint lo bloquea

// Acciones de fila: ButtonGroup + icono con nombre accesible
<ButtonGroup>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon" variant="outline" aria-label="Ver detalle"><EyeIcon /></Button>
    </TooltipTrigger>
    <TooltipContent>Ver detalle</TooltipContent>
  </Tooltip>
  <Button size="icon" variant="outline" aria-label="Editar"><PencilIcon /></Button>
</ButtonGroup>

// Logo del sidebar: ya es 35px de alto; solo cambia el logo si hay otra marca autorizada
<DashboardSidebarBrand title="IIMP Tesorería" description="0.1.0" />
<DashboardSidebarBrand title="Otro sistema" logoSrc="/logo.png" logoAlt="Otro sistema" />
```

> **Si una clase tuya no tiene efecto sobre un componente del kit:** el CSS precompilado del kit (`style.css`) no usa `@layer`, y el de Tailwind en tu app sí (`@layer utilities`); el CSS sin capa gana al CSS con capa aunque tenga la misma especificidad. Por eso un override con la misma propiedad que una clase interna del kit (por ejemplo `h-[35px]` frente a `size-full`) puede no aplicar. Los componentes del kit ya traen los valores oficiales por defecto, así que normalmente no necesitas override; si lo necesitas, usa la prop del componente (`logoSrc`, `logoClassName`, `size`…) y no parches globales con `!important`.

## 1. Instalación

```bash
npm install official-uikit-iimp
```

Requiere React 19 y react-dom 19.

### Proyectos nuevos: starter oficial

```bash
npx create-next-app@latest \
  --example "https://github.com/iimp-projects/uikit-oficial-iimp" \
  --example-path templates/next-starter \
  mi-proyecto

cd mi-proyecto
npm run setup
npm run check
```

El starter incluye Next.js App Router, Tailwind v4, TypeScript estricto, ESLint sin warnings, tests, CI, seguridad base y la instalación idempotente de skills. Consulta [`templates/next-starter/README.md`](./templates/next-starter/README.md).

El starter depende de `@nrivera-iimp/adopt` para `npm run setup`. La dependencia se instala desde npm y el comando es público.

### Actualizar una aplicación existente

Actualizar el paquete no modifica tus archivos de aplicación: solo reemplaza el contenido de `node_modules`. Actualiza en una rama, valida y adopta los nuevos patterns cuando tú lo decidas:

```bash
npm install official-uikit-iimp@0.9.2 --save-exact
npm run check
```

**0.9.2** — `FormField`: la descripción ahora va en un icono de ayuda (popover al pasar el mouse o hacer clic) junto a la etiqueta; ya no agrega una fila. Corrige la cabecera de tabla (la v0.9.1 cambiaba la fuente a serif por un `font-[bolder]` mal interpretado): ahora es Manrope 600, 13px, mayúsculas, tracking amplio y color muted, con e2e que verifica la familia. Nueva regla `iimp/filter-layout` (filtros en `FilterBar`, no un control por fila).

**0.9.1** — Nuevo `FormGrid` (columnas automáticas por ancho de contenedor, controles alineados por fila con subgrid en `FormField`) y regla `iimp/form-grid`; Cabeceras de tabla con la tipografía oficial (Manrope 600, 13px, mayúsculas; `TableHead`, `DataTable`) con regla ESLint; logo del sidebar en 35px de alto y ancho automático por defecto (ya no depende de un override que el CSS sin capa del kit podía anular); reglas `iimp/icon-button-label` y `iimp/prefer-button-group`; `prebuild` con `typecheck` + `lint` + gate de seguridad (`security:audit` / `security:verify`) y aviso en `predev`; `iimp-adopt` instala el gate y los scripts en proyectos existentes.

**0.9.0** — Nuevo armazón completo: `LoginScreen` (login) y `AppShell` (sidebar + header + main) que se configuran solo con el menú, el usuario y el contenido; el starter los trae listos. Corrige `SidebarMenuButton`/`SidebarMenuSubButton`: ya no marcan todos los ítems como activos (`data-active` solo se renderiza cuando es verdadero).

**0.8.9** — `DashboardSidebarBrand`: el logo por defecto ahora va incrustado (data URI) en el bundle, por lo que carga en cualquier ruta (`/a/b/c`) sin que la app copie archivos; nuevo prop `logoClassName` para ajustar el `<img>`. Los botones de cierre de `Dialog` y `Sheet` usan `variant="secondary"` (`text-secondary-foreground`, hover correcto) en lugar de `ghost` + `bg-secondary`.

La versión 0.8 añade `DashboardVersion`, mejora la truncación de breadcrumbs y convierte `LanguageSwitcher` en un menú accesible. `DashboardSidebarBrand` muestra el logo institucional por defecto. El prop anterior `icon` continúa por compatibilidad, pero está deprecado; reemplázalo gradualmente por `logoSrc`/`logoAlt` solo cuando realmente exista otra marca autorizada.

### Proyectos existentes: CLI de adopción

El CLI público instala y aplica el estándar sin copiar el boilerplate sobre una aplicación existente:

```bash
npx @nrivera-iimp/adopt@latest --dry-run
npx @nrivera-iimp/adopt@latest
```

Para desarrollar o validar el CLI directamente desde este repositorio:

```bash
npm install
node packages/adopt/bin/iimp-adopt.mjs --dry-run --cwd /ruta/a/tu-proyecto
```

El primer comando solo analiza. El segundo conecta el proyecto al estándar, instala las skills faltantes y genera `.iimp/ADOPTION_REPORT.md`. No actualiza una versión mayor de Next.js ni sobrescribe skills existentes silenciosamente. Consulta [`packages/adopt/README.md`](./packages/adopt/README.md).

### Bitácora y agentes

El starter y el CLI de adopción crean `bitacora.md` en la raíz. Codex, Claude y Gemini deben leerla antes de continuar y registrar cada avance relevante —fecha/hora America/Lima, cambio y validación— sin borrar el historial:

```bash
npm run bitacora -- "Se ajustó el formulario de inscripción y npm run check pasó."
```

El contrato se replica en `AGENTS.md`, `CLAUDE.md` y `GEMINI.md`. Las skills base se instalan idempotentemente para todos los agentes compatibles; el instalador usa `.agents/skills`, `.codex/skills`, `.claude/skills` y `.gemini/skills` para detectar previamente lo que ya existe.

Importa los estilos **una sola vez** en la raíz de la app. El CSS ya viene compilado: no necesitas configurar Tailwind para que los componentes se vean bien.

### Tailwind v4 en tu app (recomendado)

Si tu app usa Tailwind v4, importa también los tokens del kit en tu CSS global. Así tus clases (`text-sm`, `bg-primary`, `border-border`, `rounded-lg`…) usan los mismos tamaños y colores del kit (radio, colores y tokens del preset):

```css
/* app/globals.css */
@import "tailwindcss";
@import "official-uikit-iimp/theme.css";
```

Y en la raíz de la app (`layout.tsx`), `import "official-uikit-iimp/style.css"`. No pongas reglas `!important` ni sobrescribas `[data-slot=...]`: los componentes ya vienen terminados.

### Next.js (App Router)

```tsx
// app/layout.tsx
import "official-uikit-iimp/style.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

El paquete se distribuye con la directiva `"use client"`, así que puedes importar los componentes desde cualquier archivo.

### Vite

```tsx
// src/main.tsx
import "official-uikit-iimp/style.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

Sin más configuración, la app ya usa los colores por defecto de IIMP. El provider de tema (sección 4) es opcional.

## 2. Componentes

Antes de crear UI: busca un **pattern**; si no hay, un **primitive**; si no alcanza, extiende el kit (no lo dupliques en tu app).

### Patterns (composiciones listas)

| Componente           | Cuándo usarlo                                                                                                                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PageHeader`         | Título de página con descripción, breadcrumb y acciones.                                                                                                                                                                                |
| `FormField`          | Un campo con label, ayuda (la descripción va en un icono `?` con popover), error y marca de obligatorio. Envuelve un `Input`, `Select`, etc.                                                                                            |
| `FormSection`        | Agrupar campos relacionados bajo un título.                                                                                                                                                                                             |
| `SearchField`        | Búsqueda con debounce (300 ms por defecto).                                                                                                                                                                                             |
| `FilterBar`          | Barra de filtros con contador de filtros activos y botón "Limpiar filtros".                                                                                                                                                             |
| `DataCard`           | Card de pantallas de datos: título, contador, acciones (búsqueda/filtros) y tabla a todo el ancho.                                                                                                                                      |
| `DataTable`          | Tabla de datos con carga (skeleton), estado vacío y click en fila.                                                                                                                                                                      |
| `StatCard`           | Métrica con valor, tendencia (`up`/`down`), texto de apoyo (`hint`) e icono.                                                                                                                                                            |
| `StatusBadge`        | Estado de un registro: `success`, `warning`, `destructive`, `info`, `default`, `secondary`.                                                                                                                                             |
| `EmptyState`         | Cuando no hay datos: título, descripción y hasta dos acciones.                                                                                                                                                                          |
| `ErrorState`         | Error de página (`page`) o de bloque (`inline`) con botón de reintento.                                                                                                                                                                 |
| `LoadingState`       | Carga con `spinner` o `skeleton`.                                                                                                                                                                                                       |
| `ConfirmDialog`      | Confirmar una acción normal (guardar, enviar).                                                                                                                                                                                          |
| `DestructiveDialog`  | Confirmar una acción destructiva. Usa un verbo específico ("Eliminar participante"), nunca "Aceptar".                                                                                                                                   |
| `FormDialog`         | Formulario dentro de un diálogo, con botones cancelar y enviar.                                                                                                                                                                         |
| `InfoDialog`         | Mostrar información sin acción.                                                                                                                                                                                                         |
| `LoginScreen`        | **Login completo**: panel de marca + card con logo, botón de Google, error, estado de carga y enlaces legales. Solo pasas textos y la función de ingreso.                                                                               |
| `AppShell`           | **Dashboard completo**: sidebar con marca/menú/usuario/cierre de sesión + header con breadcrumb, idioma y notificaciones. Solo pasas menú, usuario y contenido.                                                                         |
| `AuthLayout`         | Base de `LoginScreen` (panel de marca + tu propia card). Úsalo solo si necesitas un login distinto. `brandTone` permite `primary` o `secondary`.                                                                                        |
| Familia `Dashboard*` | Base de `AppShell`. Úsala solo si necesitas un shell distinto: sidebar con sidebar responsive, logo institucional, usuario/logout, versión, header, notificaciones y main libre. `sidebarTone` permite `primary`, `secondary` o `base`. |
| `LanguageSwitcher`   | Menú compacto de idiomas por códigos ISO/BCP 47. Puede notificar a tu i18n o, temporalmente, escribir la cookie de Google Translate.                                                                                                    |

### Primitives

Button, GoogleSignInButton, Input, Textarea, Select, NativeSelect, Combobox, Checkbox, RadioGroup, Switch, Slider, Toggle, ToggleGroup, InputOTP, Calendar, Label, Field, InputGroup, Card, Table, Tabs, Accordion, Collapsible, Separator, ScrollArea, Resizable, Avatar, Badge, Alert, Progress, Skeleton, Spinner, Kbd, Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Breadcrumb, Pagination, Sidebar, Command, Carousel, Chart, Sonner (`Toaster`), y componentes de chat (Message, Bubble, MessageScroller, Attachment, Questionnaire).

Todos se importan de `official-uikit-iimp`. Los tipos incluyen la documentación de props en tu editor.

> **`Select` vs. `Combobox`:** usa `Select` solo para listas cortas y fijas (hasta ~8-10 opciones). Para listas largas, que vienen de una API, o donde el usuario probablemente busque escribiendo, usa `Combobox` — trae buscador integrado. Ver `docs/03_UX_RULES.md`.

## 3. Recetas

### Login y dashboard (armazón)

```tsx
// app/page.tsx — login
import { LoginScreen } from "official-uikit-iimp";

<LoginScreen
  systemName="IIMP Tesorería"
  systemTagline="Instituto de Ingenieros de Minas del Perú"
  eyebrow="Sistema de Constancias de Detracciones"
  headline="Del PDF masivo de SUNAT a la constancia individual, en minutos."
  description="Carga el reporte, valida cada registro y envía las constancias."
  features={[
    "Parser estándar",
    "Confirmación humana",
    "Despacho institucional",
  ]}
  subtitle="Ingresa utilizando tu correo corporativo (@iimp.org.pe)."
  action={loginAction} // o onSignIn={...}
  legal={{ privacyHref: "/politica-privacidad", termsHref: "/terminos-uso" }}
/>;
```

```tsx
// app/(app)/layout.tsx — dashboard
import { AppShell, LanguageSwitcher } from "official-uikit-iimp";

<AppShell
  brand={{ title: "IIMP Tesorería", subtitle: "0.1.0" }}
  navigation={[
    { items: [{ title: "Dashboard", href: "/", icon: <SquaresFour /> }] },
    {
      label: "Detracciones SUNAT",
      items: [
        { title: "Procesamientos", href: "/procesamientos", icon: <Files /> },
        { title: "Constancias", href: "/constancias", icon: <Certificate /> },
      ],
    },
  ]}
  currentPath={pathname}
  user={{ name: user.name, email: user.email }}
  signOutAction={logout}
  breadcrumbs={[
    { label: "Tesorería", href: "/" },
    { label: "Dashboard general" },
  ]}
  languageSwitcher={<LanguageSwitcher languages={["es", "en"]} />}
  LinkComponent={Link} // next/link
>
  {children}
</AppShell>;
```

`AppShell` marca como activo el ítem con la ruta más específica, cierra el menú en móvil al navegar, muestra el cierre de sesión solo si pasas `signOutAction` u `onSignOut`, y deja el `main` vacío si no pasas `children`.

### Shell a medida (avanzado)

Si `AppShell` no alcanza, compón las piezas base:

```tsx
import {
  DashboardHeader,
  DashboardLayout,
  LanguageSwitcher,
  DashboardNotifications,
  DashboardSidebarBrand,
  DashboardSidebarUser,
  DashboardVersion,
  Sidebar,
  SidebarContent,
} from "official-uikit-iimp";

<DashboardLayout
  sidebarTone="primary"
  sidebar={
    <Sidebar collapsible="offcanvas">
      <DashboardSidebarBrand title="Sistema IIMP" />
      <SidebarContent>
        <AppNavigation />
      </SidebarContent>
      <DashboardSidebarUser
        name={user.name}
        email={user.email}
        signOutAction={logout}
      />
    </Sidebar>
  }
  header={
    <DashboardHeader
      navigation={<AppBreadcrumb />}
      status={<DashboardVersion version={appVersion} />}
      languageSwitcher={
        <LanguageSwitcher
          languages={["es", "en", "qu"]}
          onValueChange={changeLocale}
        />
      }
      notifications={<DashboardNotifications count={alerts.length} />}
      actions={<PageActions />}
    />
  }
>
  {children}
</DashboardLayout>;
```

Routing, permisos, sesión y logout permanecen en la app. Ver receta completa en `docs/03_UX_RULES.md`.

`DashboardSidebarBrand` usa por defecto el logo PNG institucional en un recuadro blanco. Si un producto autorizado necesita otra marca, pasa `logoSrc` y `logoAlt`; no hace falta crear ni mantener iconos por sistema.

### Idioma y Google Translate

`LanguageSwitcher` crea un menú accesible desde los códigos que recibe y se ubica inmediatamente a la izquierda de la campana cuando se pasa mediante `DashboardHeader.languageSwitcher`. Al seleccionar, actualiza su estado y emite `onValueChange`; la integración recomendada es conectarlo al proveedor i18n de la aplicación.

Para una integración existente con Google Website Translator, activa su bridge de cookie:

```tsx
<LanguageSwitcher
  languages={["es", "en", "qu"]}
  googleTranslate={{ sourceLanguage: "es" }}
/>
```

El componente añade el objetivo oculto que requiere Google, carga el script una vez si aún no existe, guarda `googtrans`, recarga la página y oculta automáticamente el banner/iframe superior que Google inyecta en `<body>` (no hace falta CSS propio para eso). Es una compatibilidad temporal: consulta la guía completa de props, el bridge y solución de problemas en [`docs/17_LANGUAGE_SWITCHER.md`](./docs/17_LANGUAGE_SWITCHER.md).

Para excluir contenido de la traducción (RUCs, códigos, nombres propios), aplica `className="no-translate"` — mientras haya un `LanguageSwitcher` en la página, el componente lo marca automáticamente con lo que Google/el navegador realmente requieren (`translate="no"` + `notranslate`), incluso en contenido agregado después del montaje.

### Formulario con varios campos (`FormGrid`)

Para poner varios campos en una fila no uses `grid-cols-N`, `flex` ni anchos fraccionarios: usa `FormGrid`. Calcula cuántas columnas caben **según el ancho del contenedor** (no del viewport), así el mismo formulario funciona en un drawer de 360px (1 columna) y en una página ancha (varias), y estira los campos para llenar cada fila sin dejar huecos.

```tsx
import { FormField, FormGrid, Input, Textarea } from "official-uikit-iimp";

<FormGrid>
  <FormField label="RUC" required>
    <Input />
  </FormField>
  <FormField label="Razón social">
    <Input />
  </FormField>
  <FormField label="Correo(s)" description="Varios separados por coma.">
    <Input />
  </FormField>
  <FormField label="Teléfono">
    <Input />
  </FormField>
  {/* un campo que necesita su propia fila */}
  <FormField label="Notas internas" className="col-span-full">
    <Textarea />
  </FormField>
</FormGrid>;
```

- `minFieldWidth` (por defecto `14rem`) es el ancho mínimo cómodo de un campo; `<FormGrid minFieldWidth="10rem">` permite más columnas para campos cortos (serie, número, fecha).
- **La descripción va en un icono de ayuda (`?`) junto a la etiqueta**, no como un párrafo entre la etiqueta y el input: al pasar el mouse se muestra, con clic/tap/Enter queda fijada (se cierra con otro clic, Escape o clic afuera). Así ningún campo agrega altura y **los controles quedan alineados en la fila** (también si una etiqueta se parte en dos líneas o un vecino muestra un error). El texto sigue disponible para lectores de pantalla vía `aria-describedby`. `FormField` usa subgrid con tres filas fijas (etiqueta + ayuda, control, error); fuera de un `FormGrid` se comporta como una pila normal.
- **Todos los controles llenan su celda:** dentro de `FormField`, el `Select` ocupa el 100 % del ancho (antes quedaba como una caja chica) y `Input`, `Textarea`, `NativeSelect` y `InputGroup` ya lo hacían.
- **Filtros:** `<FilterBar>` pone el buscador, los selects y el botón en una sola fila que se envuelve según el ancho; la regla `iimp/filter-layout` falla si apilas 2 o más controles sueltos (`Input`, `Select`, `Combobox`…) uno bajo otro con `flex-col` o sin maqueta, que es lo que dejaba cada filtro en su propia fila al 100 %.
- **¿Y las descripciones que ya tenía escritas a mano?** Las que ya usan la prop `description` de `FormField` pasan solas al icono de ayuda al actualizar el kit (misma API). Las que escribiste como `<p className="text-sm text-muted-foreground">` o `<FieldDescription>` junto a un `Label` + control las marca la regla `iimp/field-description` con el mensaje de qué hacer: mueve ese texto a `description="…"` de `<FormField>` (cambio mecánico de una línea por campo).
- La regla `iimp/form-grid` también falla si un control dentro de `FormField` lleva un ancho fijo (`w-40`, `w-fit`, `w-[200px]`, `max-w-*`): el ancho lo decide `FormGrid`, no el control.
- La regla `iimp/form-grid` falla si pones 2 o más `FormField` en un contenedor con `grid-cols-N`/`flex` en fila, o si asignas anchos como `w-1/4`, `w-[25%]` o `basis-*` a un `FormField` o a su contenedor (eso es lo que dejaba el hueco al costado).

### Formulario

```tsx
import {
  Button,
  FormField,
  FormSection,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "official-uikit-iimp";

export function ParticipanteForm() {
  return (
    <form className="flex flex-col gap-6">
      <FormSection
        title="Datos personales"
        description="Se usan para la acreditación."
      >
        <FormField label="Nombre" required error={undefined}>
          <Input name="nombre" />
        </FormField>
        <FormField label="Evento" required>
          <Select name="evento">
            <SelectTrigger aria-label="Evento">
              <SelectValue placeholder="Selecciona un evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perumin">PERUMIN</SelectItem>
              <SelectItem value="expomina">ExpoMina</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>
      <Button type="submit">Guardar</Button>
    </form>
  );
}
```

`FormField` recibe **un solo hijo** (`children: ReactElement`) y le asocia label, descripción y error.

### Tabla con filtros, carga y estado vacío

```tsx
import { useState } from "react";
import {
  DataTable,
  EmptyState,
  FilterBar,
  PageHeader,
  SearchField,
  StatusBadge,
} from "official-uikit-iimp";

type Participante = {
  id: number;
  nombre: string;
  estado: "success" | "warning";
};

export function Participantes({
  data,
  loading,
}: {
  data: Participante[];
  loading: boolean;
}) {
  const [query, setQuery] = useState("");
  const rows = data.filter((p) =>
    p.nombre.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader title="Participantes" description="Inscritos al evento" />
      <FilterBar activeCount={query ? 1 : 0} onClear={() => setQuery("")}>
        <SearchField
          value={query}
          onSearch={setQuery}
          placeholder="Buscar participante…"
        />
      </FilterBar>
      <DataTable
        loading={loading}
        data={rows}
        getRowId={(row) => row.id}
        columns={[
          { key: "nombre", header: "Nombre" },
          {
            key: "estado",
            header: "Estado",
            cell: (row) => (
              <StatusBadge status={row.estado}>
                {row.estado === "success" ? "Confirmado" : "Pendiente"}
              </StatusBadge>
            ),
          },
        ]}
        emptyState={
          <EmptyState
            title="Sin participantes"
            description="Prueba con otra búsqueda."
          />
        }
      />
    </>
  );
}
```

### Confirmación (normal y destructiva)

```tsx
import { Button, ConfirmDialog, DestructiveDialog } from "official-uikit-iimp"

<ConfirmDialog
  trigger={<Button>Enviar invitaciones</Button>}
  title="¿Enviar invitaciones?"
  description="Se enviará un correo a los 120 inscritos."
  confirmLabel="Enviar"
  onConfirm={async () => { await enviar() }}
/>

<DestructiveDialog
  trigger={<Button variant="destructive">Eliminar</Button>}
  title="Eliminar participante"
  description="Se borrará su inscripción y no se puede deshacer."
  confirmLabel="Eliminar participante"
  onConfirm={async () => { await eliminar() }}
/>
```

Con `onConfirm` asíncrono el diálogo **no se cierra solo**: controla `open` / `onOpenChange` y ciérralo cuando termine la acción.

### Estados vacío, error y carga

```tsx
import { EmptyState, ErrorState, LoadingState } from "official-uikit-iimp"

<LoadingState variant="skeleton" lines={4} label="Cargando participantes" />

<EmptyState
  title="Aún no hay inscritos"
  description="Comparte el enlace de registro."
  primaryAction={{ label: "Copiar enlace", onClick: copiar }}
/>

<ErrorState
  title="No pudimos cargar los datos"
  description="Revisa tu conexión e inténtalo de nuevo."
  retry={{ label: "Reintentar", onClick: recargar }}
/>
```

## 4. Theming (opcional)

Por defecto el kit usa el preset de shadcn `b1aIuQ2XC` (estilo luma, iconos Remix) con las decisiones de IIMP: colores primary `#092042` y secondary `#f2e8dd` con texto `#c09153`; **radio de 10px** en controles y ~14px en cards (los controles circulares como Switch, Radio o Avatar siguen `rounded-full`); campos de formulario con fondo blanco sólido y borde sutil; sombra `shadow-sm` en superficies en reposo (los menús y modales mantienen más elevación); y tipografía de cuerpo con la pila `system-ui` (San Francisco en Mac/iOS, Segoe UI en Windows, mínimo 13px) con títulos en **SF Pro Display** (mínimo 20px).

Para cambiar colores o radio por vertical, envuelve la app:

```tsx
import { IimpThemeProvider } from "official-uikit-iimp";

<IimpThemeProvider
  theme={{
    primary: "#092042",
    secondary: "#f2e8dd",
    secondaryForeground: "#c09153", // par de marca
    radius: "0.625rem",
  }}
>
  <App />
</IimpThemeProvider>;
```

- `primary` y `secondary` son obligatorios dentro de `theme`; `radius`, `primaryForeground` y `secondaryForeground` son opcionales.
- Si no envías un foreground, se calcula automáticamente por contraste (blanco u oscuro, el de mayor ratio). Si cambias `secondary` y quieres conservar el texto `#c09153`, pásalo explícitamente.
- **Accesibilidad:** el par de marca `#c09153` sobre `#f2e8dd` tiene un contraste de ~2.4:1 y no cumple WCAG AA (4.5:1) para texto normal. Úsalo en texto grande o acompañado de icono/borde.
- No hardcodees colores de marca (`#hex`, `rgb()`) ni escribas reglas por vertical (`if (vertical === "perumin")`): todo pasa por el `theme`.

### Densidad y números

Todo el kit está en `rem` con raíz de 16px (tamaño original de shadcn). Para escalarlo, define `--iimp-root-font-size` (ej. `106%`). Los números salen con cifras alineadas a la línea base (`lining-nums`) y las tablas con `tabular-nums`.

### Fondos y líneas

Los componentes (Input, Select, Card, Popover…) traen **fondo blanco sólido** por defecto. Para cambiarlo pasa `className`:

```tsx
<Card className="bg-muted">…</Card>
```

Para separar secciones usa `<Separator />` o la clase `border-border` (línea fina de 1px). Si en tu app escribes `border-b` a secas, Tailwind lo pinta con el color del texto (negro). Añade siempre `border-border`.

## 5. Jerarquía de botones

Las variantes representan intención y jerarquía, no colores corporativos. `variant="default"` es la acción Primary dominante del contexto; `secondary` es una alternativa importante subordinada, no “el segundo botón”; `outline` mantiene visible una acción menor; `ghost` sirve para acciones auxiliares; y `destructive` se reserva para consecuencias destructivas o irreversibles.

Como regla general, usa como máximo un Primary dominante por dialog, formulario, card, sección funcional, paso de wizard o panel de acciones. Una página puede tener varios si pertenecen a contextos independientes. Consulta ejemplos correctos, incorrectos y el criterio para `Cancelar`/`Cerrar` en `docs/03_UX_RULES.md` → “Jerarquía de acciones”.

## 6. Guardrails de ESLint (recomendado)

```js
// eslint.config.js de la app consumidora
import { iimpGuardrails } from "official-uikit-iimp/eslint";

export default [
  // ...tu config existente
  ...iimpGuardrails,
];
```

El maquetado se hace **siempre con el componente equivalente del kit** (shadcn/ui), no con HTML nativo. El linter falla y te dice cuál usar:

| En vez de                             | Usa                                     |
| ------------------------------------- | --------------------------------------- |
| `<button>`                            | `Button`                                |
| `<input>` / `<select>` / `<textarea>` | `Input` / `Select` / `Textarea`         |
| `<label>`                             | `Label` o `FormField`                   |
| `<table>`, `<tr>`, `<td>`…            | `Table` o `DataTable`                   |
| `<hr>`                                | `Separator`                             |
| `<progress>`                          | `Progress`                              |
| `<dialog>`                            | `Dialog`, `ConfirmDialog`, `FormDialog` |
| `<details>`                           | `Accordion` / `Collapsible`             |

También incluye las reglas propias `iimp/icon-button-label` (botón solo icono exige `size="icon*"` + `aria-label`), `iimp/prefer-button-group` (2 o más botones contiguos del mismo nivel → `ButtonGroup`) y el bloqueo de tipografía en `<TableHead>`.

Además bloquea `className` con bordes sin color (`border-b` a secas se pinta negro; usa `border-border` o `Separator`), imports directos de Radix/Base UI/shadcn, rutas internas del paquete e imports de copias locales de `AuthLayout` o la familia `Dashboard*` oficial.

### Perfil completo “zero errors” para Next.js

```js
// eslint.config.mjs
import iimpNextStrict from "official-uikit-iimp/eslint/next-strict";

export default iimpNextStrict;
```

```json
{
  "extends": "official-uikit-iimp/tsconfig/next-strict.json"
}
```

Ejecuta ESLint con `--max-warnings=0` y usa un quality gate que incluya formato, typecheck, lint, pruebas y build. La arquitectura completa está documentada en [`docs/16_PROJECT_BOOTSTRAP.md`](./docs/16_PROJECT_BOOTSTRAP.md).

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md), `AGENTS.md` y `docs/`.
