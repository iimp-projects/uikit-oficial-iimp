# AGENTS.md — IIMP UI Governance

Este documento es obligatorio para cualquier agente que modifique UI.

## Source of truth

Orden de autoridad:

1. `docs/02_DESIGN_TOKENS.md`
2. `docs/03_UX_RULES.md`
3. `docs/04_ACCESSIBILITY.md`
4. `docs/05_MOTION.md`
5. `docs/06_COMPONENT_CATALOG.md`
6. `docs/07_PATTERNS.md`
7. implementación actual de `official-uikit-iimp`

## Regla principal

Las aplicaciones consumidoras **componen** UI; no crean un sistema visual paralelo.

Antes de crear UI:

1. buscar un pattern en `official-uikit-iimp`;
2. buscar un primitive en `official-uikit-iimp`;
3. reutilizarlo;
4. si no alcanza, determinar si debe extenderse `official-uikit-iimp`.

## Prohibido

**Todo maquetado se hace con el componente equivalente de `official-uikit-iimp` (basado en shadcn/ui).** No se arma UI con HTML nativo ni con estilos propios que dupliquen un componente. Equivalencias:

| Nativo / maquetado manual | Usar |
|---|---|
| `<button>` | `Button` |
| `<input>` | `Input` (`Checkbox`, `RadioGroup`, `Switch`, `Slider` según el tipo) |
| `<select>` | `Select` / `NativeSelect` |
| `<textarea>` | `Textarea` |
| `<label>` | `Label` / `FormField` |
| `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | `Table` / `DataTable` |
| `<hr>`, `border-b` a secas | `Separator` o `border-b border-border` |
| `<progress>` | `Progress` |
| `<dialog>` | `Dialog`, `AlertDialog`, `ConfirmDialog`, `FormDialog` |
| `<details>` / `<summary>` | `Accordion` / `Collapsible` |
| `<kbd>` | `Kbd` |
| card, badge, alert, tabs armados con `div` | `Card`, `Badge`, `Alert`, `Tabs` |

Esto lo hace cumplir `iimpGuardrails` (`official-uikit-iimp/eslint`): el linter falla y nombra el componente a usar.

No importar la capa interna de accesibilidad/primitives directamente desde aplicaciones consumidoras.

No hardcodear colores de marca:

```text
#[hex]
rgb(...)
rgba(...)
hsl(...)
hsla(...)
```

No escribir reglas específicas por vertical:

```ts
if (vertical === "perumin")
```

No inventar:
- alturas,
- radius,
- shadow,
- spacing,
- tamaños tipográficos,
- motion duration,
- ancho de dialog,
- focus rings.

No utilizar `transition-all`.

## Imports

La app consumidora debe preferir:

```tsx
import {
  Button,
  Input,
  Select,
  FormField,
  FormDialog,
  ConfirmDialog,
  DataTable,
} from "official-uikit-iimp"
```

## Login / Auth

No armar la pantalla de login a mano. Usar `AuthLayout` (shell de dos columnas: panel de marca + tu propia card de login) y `GoogleSignInButton` (botón con el logo oficial de Google) si el proyecto usa Google. Ninguno de los dos implementa autenticación: reciben la lógica real (`onClick`/`formAction`) del proyecto. Receta completa en `docs/03_UX_RULES.md` → "AuthLayout".

## className

Permitido principalmente para layout:

```tsx
<Button className="w-full md:w-auto" />
```

No permitido para redefinir identidad del componente:

```tsx
<Button className="h-16 rounded-full bg-purple-600 shadow-xl" />
```

Si la API del componente no soporta una necesidad real, proponer extensión del UI Kit.

## Theme

El branding proviene del runtime theme:

```text
primary
primary-foreground
secondary
secondary-foreground
radius
```

Los componentes consumen tokens; nunca reciben conocimiento de la vertical.

## Buttons

- default → acción principal
- secondary → acción secundaria con énfasis
- outline → cancelar/volver/neutra
- ghost → baja jerarquía
- destructive → irreversible o peligrosa
- link → navegación/acción tipo enlace

## Dialogs

- crear/editar/configurar → `FormDialog`
- información → `InfoDialog`
- confirmación → `ConfirmDialog`
- destructivo → `DestructiveDialog`

No construir dialogs custom en features sin justificación.

## Forms

Campos etiquetados:
- `FormField`
- control oficial (`Input`, `Select`, etc.)

**`Select` solo para listas cortas (hasta ~8-10 opciones).** Si la lista es larga, viene de una API/base de datos, o el usuario necesita escribir para encontrar la opción, usar `Combobox` (tiene buscador integrado). `Select` obliga a leer la lista completa desplazándose; en listas largas eso es más lento y menos accesible que escribir 2-3 letras. No es una regla de lint (la cantidad de opciones suele depender de datos en runtime, no se puede verificar de forma estática) — es criterio a aplicar antes de elegir el control, igual que "busca un Pattern/Primitive antes de crear uno nuevo".

No construir labels/error text con estilos manuales salvo caso no cubierto por el pattern.

## UX

- target interactivo recomendado: 44x44 CSS px
- CTA touch-first: 48px cuando corresponda
- icon buttons: 44x44px mínimo como estándar IIMP
- estados de hover/focus/active/disabled obligatorios cuando correspondan
- no comunicar estados solo por color

## Motion

- usar tokens
- 120–250ms como rango normal del sistema
- respetar `prefers-reduced-motion`
- motion comunica estado; no decorar gratuitamente

## Trabajo de migración

Una migración visual NO debe alterar:
- APIs,
- business rules,
- permisos,
- routing,
- validaciones,
- estado,
- hooks,
- persistencia,
- side effects.

Ante duda, conservar comportamiento y limitar cambios a presentación.
