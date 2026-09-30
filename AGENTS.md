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
  AuthLayout,
  DashboardLayout,
  DashboardHeader,
  DashboardSidebarBrand,
  DashboardSidebarUser,
  DashboardNotifications,
} from "official-uikit-iimp"
```

## Login / Auth

No armar la pantalla de login a mano. Usar `AuthLayout` (shell de dos columnas: panel de marca + tu propia card de login) y `GoogleSignInButton` (botón con el logo oficial de Google) si el proyecto usa Google. `brandTone="primary" | "secondary"` cambia el panel mediante tokens semánticos; no recrear el layout para cambiar color. Ninguno implementa autenticación: reciben la lógica real (`onClick`/`formAction`) del proyecto. Receta completa en `docs/03_UX_RULES.md` → "AuthLayout".

## Dashboard / App shell

No armar el shell autenticado a mano. Usar `DashboardLayout` para componer `Sidebar`, `DashboardHeader` y el contenido de la ruta. Para el shell estándar usar también `DashboardSidebarBrand`, `DashboardSidebarUser` y `DashboardNotifications`. La app conserva navegación, routing, permisos, sesión y acciones; los patterns conservan estructura responsive, landmark principal, gutters, alineación visual y controles comunes.

`sidebarTone="primary" | "secondary" | "base"` cambia la familia de tokens del sidebar. El valor por defecto es `primary`. No hardcodear colores ni duplicar `AppLayout`/`DashboardLayout` dentro de cada proyecto. Receta completa en `docs/03_UX_RULES.md` → "DashboardLayout".

El sidebar autenticado usa `collapsible="offcanvas"`: al cerrarlo desaparece completamente hacia la izquierda y `SidebarInset`/main recupera todo el ancho. No dejar una franja de iconos. `DashboardSidebarBrand` y `DashboardHeader` comparten altura desktop; sus divisores inferiores deben coincidir. `SidebarMenuButton` mantiene target de 44px y radius de 10px mediante tokens. El footer de usuario y la campana no implementan logout ni consultas: reciben la lógica y datos reales de la app.

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

Las variantes comunican jerarquía e intención, no colores corporativos.

- `default` es el nombre técnico de Primary → única acción dominante del contexto visual.
- `secondary` → alternativa importante subordinada; nunca usarla automáticamente por ser el segundo botón.
- `outline` → acción secundaria visible que no debe competir con Primary.
- `ghost` → acción auxiliar, contextual o de baja jerarquía.
- `destructive` → intención destructiva, irreversible o de alto impacto; puede dominar una confirmación destructiva.
- `link` → navegación/acción tipo enlace.

Un contexto visual es un dialog, formulario, card, sección funcional, wizard step o panel de acciones. Como regla general, debe haber como máximo un Primary dominante por contexto; una página puede tener varios si pertenecen a contextos independientes.

Para `Cancelar`/`Cerrar`, usar `outline` si la salida segura necesita visibilidad y `ghost` si es auxiliar. No decidir la variante solo por el texto. Antes de modificar una interfaz existente, señalar cualquier incumplimiento de jerarquía. Ver ejemplos y anti-patterns en `docs/03_UX_RULES.md` → “Jerarquía de acciones”.

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
