# MASTER PROMPT — Construcción de `@iimp/ui`

Quiero construir un proyecto independiente llamado `@iimp/ui`.

Será el Design System / UI Kit oficial de Eventos IIMP y podrá ser consumido por aplicaciones React/Next.js.

## Restricción principal

Este proyecto NO contiene lógica de negocio.

Su responsabilidad es exclusivamente:
- design tokens,
- componentes visuales,
- patrones UX,
- theming runtime,
- accesibilidad,
- motion,
- documentación,
- pruebas,
- reglas de gobernanza.

## Stack obligatorio

- React
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- primitives/accessibility provistos por la implementación actual de shadcn cuando corresponda
- class-variance-authority
- clsx / tailwind-merge cuando sean necesarios
- Lucide React como iconografía predeterminada
- Storybook para catálogo visual

No introducir otra librería visual sin aprobación explícita.

## Paso 1 — Discovery antes de modificar

Antes de crear componentes:

1. Lee todos los `.md` de este repositorio.
2. Genera `BUILD_PLAN.md`.
3. Propón estructura final de carpetas.
4. Define dependencias y peerDependencies.
5. Define token taxonomy.
6. Define API pública de `IimpThemeProvider`.
7. Define catálogo de primitives.
8. Define catálogo de patterns.
9. Define estrategia de exports.
10. Define estrategia NPM.
11. Define validaciones CI.

No implementes componentes hasta terminar este análisis.

## Theme runtime

La aplicación consumidora obtiene una vertical desde base de datos.

Ejemplo conceptual:

```ts
{
  primaryColor: "hsl(24 83% 50%)",
  secondaryColor: "hsl(188 100% 17%)",
  radius: "0.75rem"
}
```

Debe poder hacer:

```tsx
<IimpThemeProvider
  theme={{
    primary: vertical.primaryColor,
    secondary: vertical.secondaryColor,
    radius: vertical.radius,
  }}
>
  <App />
</IimpThemeProvider>
```

El provider debe alimentar tokens semánticos.

Los componentes jamás deben conocer nombres de verticales.

PROHIBIDO:

```ts
if (vertical === "perumin")
if (vertical === "proexplo")
```

PROHIBIDO en componentes:

```tsx
className="bg-[#ff6600]"
style={{ color: primaryColor }}
```

Usar tokens semánticos:

```text
primary
primary-foreground
secondary
secondary-foreground
background
foreground
muted
muted-foreground
accent
accent-foreground
destructive
border
input
ring
```

## Brand vs Product tokens

Cambian por vertical:

```text
primary
primary-foreground
secondary
secondary-foreground
radius (solo si se mantiene como requisito actual)
```

Pertenecen al producto:

```text
background
foreground
card
popover
muted
accent
border
input
ring
destructive
success
warning
info
spacing
typography
motion
elevation
```

No mezclar ambos conceptos.

## UX sizing

Aplicar como estándar del producto:

- target interactivo recomendado: `44x44 CSS px`
- Button default: 44px de alto
- Button large / CTA touch-first: 48px
- IconButton: área interactiva mínima 44x44px
- Input / Select / Combobox default: 44px
- controles compactos menores solo en contextos desktop explícitos

No confundir altura visual con área de interacción.

## Motion

Crear tokens:
- fast: 120ms
- normal: 180ms
- slow: 250ms
- easing estándar consistente

Reglas:
- no usar `transition-all`
- usar motion para feedback y cambio de estado, no decoración
- respetar `prefers-reduced-motion`
- button press state obligatorio
- dialogs/popovers/dropdowns deben tener entrada/salida suave y corta

## Componentes

Normalizar todos los componentes shadcn listados en `docs/06_COMPONENT_CATALOG.md`.

No crear wrappers por defecto.

Regla:

> Si solo cambia el aspecto, modifica/configura el primitive.
> Si se repite una composición o comportamiento, crea un pattern.

## Patterns iniciales

Crear:
- FormDialog
- InfoDialog
- ConfirmDialog
- DestructiveDialog
- FormField
- FormSection
- DataTable
- PageHeader
- EmptyState
- LoadingState
- ErrorState
- StatCard
- StatusBadge
- FilterBar
- SearchField

No crear más patterns sin necesidad demostrada.

## Forms

Todos los campos etiquetados deben poder representarse mediante `FormField`.

Ejemplo:

```tsx
<FormField
  label="Nombre visible"
  required
  description="Nombre mostrado al participante."
  error={errors.name?.message}
>
  <Input />
</FormField>
```

Normalizar:
- label,
- required indicator,
- description,
- control,
- error,
- disabled,
- readonly,
- focus,
- help text.

No agregar iconos decorativos arbitrarios en labels.

## Buttons

API semántica:

```tsx
<Button>Guardar</Button>
<Button variant="secondary">Acción secundaria</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Acción terciaria</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="link">Ver detalle</Button>
```

No estilizar botones manualmente en apps consumidoras.

## Dialogs

Primitive:
- Dialog
- AlertDialog

Patterns:
- FormDialog → crear/editar/configurar
- InfoDialog → información
- ConfirmDialog → confirmar acción reversible/no destructiva
- DestructiveDialog → eliminar/anular/acción irreversible

Normalizar:
- width,
- max-height,
- header,
- body,
- footer,
- scroll,
- responsive,
- mobile behavior,
- focus management.

## Storybook

Crear documentación de:
- foundations,
- todos los primitives,
- todos los patterns,
- todos los estados.

Cada componente debe mostrar cuando aplique:
- default
- hover
- focus
- active
- disabled
- loading
- error
- readonly

Crear Theme Playground:
- primary
- secondary
- radius
- light/dark si está soportado

La modificación debe reflejarse en todo el catálogo en runtime.

## Guardrails

Aplicar reglas que impidan en apps consumidoras:
- `<button>` directo cuando exista Button del UI Kit
- `<input>`, `<select>`, `<textarea>` directos cuando exista equivalente
- imports directos de la capa interna de primitives
- imports directos de Radix/Base UI/etc. salvo dentro de `@iimp/ui`
- colores HEX/RGB/HSL hardcodeados fuera de archivos autorizados
- overriding visual arbitrario vía `className`

`className` en apps consumidoras debe reservarse preferentemente para layout.

## Calidad

Después de cada fase ejecutar:
- typecheck
- lint
- tests
- build
- Storybook build
- accessibility checks cuando aplique

No continuar con errores.

## Implementación por fases

### Phase 0 — Discovery
Arquitectura + tokens + plan + exports.

### Phase 1 — Foundation
Theme + tokens + helpers.

### Phase 2 — Primitives
Shadcn completo según catálogo.

### Phase 3 — Forms + Dialog Patterns

### Phase 4 — Data + Navigation + Feedback

### Phase 5 — Storybook + Theme Playground

### Phase 6 — Guardrails + tests + docs

### Phase 7 — package build + consumer example

En cada fase:
1. indicar alcance,
2. realizar cambios,
3. ejecutar validaciones,
4. registrar decisiones,
5. no avanzar si falla el exit criteria.

## Fuente de verdad

Leer obligatoriamente:
- `AGENTS.md`
- `docs/01_ARCHITECTURE.md`
- `docs/02_DESIGN_TOKENS.md`
- `docs/03_UX_RULES.md`
- `docs/04_ACCESSIBILITY.md`
- `docs/05_MOTION.md`
- `docs/06_COMPONENT_CATALOG.md`
- `docs/07_PATTERNS.md`
- `docs/08_THEMING.md`
- `docs/09_GUARDRAILS.md`
- `docs/10_TESTING_AND_QA.md`

No inventes una nueva regla visual si estos documentos ya resuelven el caso.
