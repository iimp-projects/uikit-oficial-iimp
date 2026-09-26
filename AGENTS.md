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

No usar controles nativos directamente cuando exista equivalente:

```tsx
<button />
<input />
<select />
<textarea />
```

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
