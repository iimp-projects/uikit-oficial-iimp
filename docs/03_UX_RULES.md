# UX Rules

## Principio

El UI Kit no debe ser solo visual. Debe imponer ergonomía, jerarquía y comportamiento consistentes.

## Target size

Estándar interno IIMP:

```text
44x44 CSS px recomendado para targets interactivos generales.
48px para CTA touch-first cuando el contexto lo justifique.
```

Nota normativa:
- WCAG 2.2 AA 2.5.8 define un mínimo de 24x24 CSS px con excepciones.
- WCAG 2.2 AAA 2.5.5 utiliza 44x44 CSS px.
- IIMP adopta 44px como estándar de producto para aumentar comodidad táctil.

## Controls

Recomendación inicial:

| Control | Tamaño |
|---|---:|
| Button default | 50px alto |
| Button large | 56px alto |
| Button small | 50px (mismo alto; solo cambia el padding) |
| Icon button | 50x50px (icon-sm también 50) |
| Input | 50px alto fijo, texto 16px, fondo blanco sólido |
| Select trigger | 50px alto |
| Combobox | 50px alto |
| Date trigger | 50px alto |

No todo elemento visual debe medir 44px; el **target interactivo** sí debe cumplir el estándar elegido.

## Jerarquía de acciones

Una sección lógica debe evitar múltiples CTAs compitiendo.

- primary → acción dominante
- secondary → apoyo con énfasis
- outline → cancelar/volver/neutra
- ghost → contextual
- destructive → irreversible

## Forms

Orden:

```text
Label
Description opcional
Control
Error/Help
```

Reglas:
- label siempre visible cuando el contexto lo requiera;
- placeholder no reemplaza label;
- error debe explicar qué corregir;
- no depender solo de color para error;
- mantener distancia consistente entre campos.

## Dialogs

No usar modal para cualquier cosa.

- operación corta y focal → Dialog
- confirmación crítica → Alert/Confirm pattern
- contenido extenso → considerar Sheet/Drawer/Page
- formulario largo → body scrollable, acciones persistentes si es necesario

Evitar dialogs anidados salvo necesidad justificada.

## Responsive

Diseñar mobile-first en targets y reflow.

- evitar horizontal scroll accidental;
- acciones principales accesibles;
- tablas deben tener estrategia responsive explícita;
- dialogs deben adaptarse al viewport.

## Density

V1 recomendada: una densidad estándar.

Agregar `compact` solo si existe una necesidad real de dashboard denso. No introducir dos sistemas de tamaño desde el inicio sin necesidad.

## Feedback

Toda acción asíncrona importante debe tener estado:
- loading,
- success,
- error,
- disabled cuando corresponda.

No permitir doble submit.

## Empty states

Deben explicar:
1. qué ocurre,
2. por qué está vacío cuando sea útil,
3. siguiente acción cuando exista.

## Destructive actions

- diferenciación semántica clara;
- confirmación proporcional al riesgo;
- texto específico: "Eliminar participante" mejor que "Aceptar";
- no usar confirmación destructiva para operaciones triviales.

## Actualización visual (v0.2)

- **Texto: 14px/24px** (ver homologación v0.3). Jerarquía por peso y color.
- **Superficies sólidas.** Inputs, selects, cards y popovers usan fondo blanco opaco (`--background`, `--card`, `--popover`). Para cambiarlo, pasa `className` (ej. `<Card className="bg-muted">`).
- **Iconos:** 24px por defecto (20px en tamaño `sm`, 28px en `lg`).
- **Líneas:** 1px con `--border` (slate claro). Nunca negro. Usa `<Separator />` o `border-border`.
- **Tabs:** alto 44px; variante `line` con subrayado primary de 2px.
- **Checkbox/Radio 20px, Switch 48x28**, todos con área de clic de 44px+.
- Items de menús abiertos: 44px de alto.

## Homologación de tamaños (v0.3)

- **Todo control interactivo mide mínimo 50px:** Button (todas las variantes y tamaños), Input, Select, Combobox, Tabs (trigger), Toggle/ToggleGroup, Menubar, NavigationMenu y botones de Sidebar. Checkbox, Radio y Switch mantienen visual pequeño con área de clic de 50px+.
- Excepciones documentadas: botones `icon-xs` dentro de un campo de 50px (24px), items de menús desplegados y links anidados del sidebar (44px). Breadcrumb links: 50px.
- **Texto: 14px/24px en todo el kit** (`text-xs`, `text-sm` y `text-base` resuelven a 14px). Los títulos usan su propia escala (`CardTitle` 20px, `h1` 30px).
- **Radio base 10px.** Fondo de inputs: blanco sólido con borde fino.
- **Colores derivados de `--primary`:** muted, accent, border, input, ring, chart y sidebar se calculan con `color-mix`. Al cambiar el color en `IimpThemeProvider`, todo el kit se retiñe.
- **No sobrescribir** altura, tamaño de texto ni colores sueltos en componentes del kit: el linter (`iimpGuardrails`) lo bloquea.
