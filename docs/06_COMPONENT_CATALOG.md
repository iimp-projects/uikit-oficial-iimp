# Component Catalog

Este documento define el alcance de primitives a revisar/normalizar.

La lista está basada en el catálogo actual de shadcn/ui al momento de preparar este blueprint. shadcn puede agregar componentes; validar contra documentación oficial al iniciar el proyecto.

## Catalog

- Accordion
- Alert
- Alert Dialog
- Aspect Ratio
- Attachment
- Avatar
- Badge
- Breadcrumb
- Bubble
- Button
- Button Group
- Calendar
- Card
- Carousel
- Chart
- Checkbox
- Collapsible
- Combobox
- Command
- Context Menu
- Data Table
- Date Picker
- Dialog
- Direction
- Drawer
- Dropdown Menu
- Empty
- Field
- Hover Card
- Input
- Input Group
- Input OTP
- Item
- Kbd
- Label
- Marker
- Menubar
- Message
- Message Scroller
- Native Select
- Navigation Menu
- Pagination
- Popover
- Progress
- Questionnaire
- Radio Group
- Resizable
- Scroll Area
- Select
- Separator
- Sheet
- Sidebar
- Skeleton
- Slider
- Spinner
- Switch
- Table
- Tabs
- Textarea
- Toast / Sonner según versión elegida
- Toggle
- Toggle Group
- Tooltip
- Typography

## Política por componente

Para cada primitive documentar:

1. Purpose
2. Anatomy
3. Variants
4. Sizes
5. States
6. Keyboard behavior
7. Responsive behavior
8. Accessibility notes
9. Allowed overrides
10. Do/Don't
11. Storybook stories

## Estados mínimos cuando aplique

- default
- hover
- focus-visible
- active/pressed
- disabled
- selected
- loading
- invalid
- readonly

## No wrapper por defecto

No crear:

```text
IimpAccordion
IimpCheckbox
IimpSwitch
```

si el primitive oficial ya satisface la API.

Modificar/normalizar el primitive.

## Componentes que suelen justificar pattern

No confundir primitive con pattern.

Ejemplos:
- Dialog → primitive
- FormDialog → pattern
- Table → primitive
- DataTable → pattern
- Input → primitive
- FormField → pattern
- Empty → primitive
- EmptyState con acción/contexto IIMP → puede ser pattern si aporta composición real

## Button sizes propuestos

```text
sm      36px — solo contexto compacto desktop
default 44px
lg      48px
icon    target mínimo 44x44px
```

## Form controls

Default recomendado:
- 44px de alto en controles interactivos principales.

## Regla para nuevos componentes de shadcn

Cuando shadcn agregue un componente:

1. evaluar si resuelve una necesidad real;
2. revisar tokens;
3. revisar tamaños;
4. revisar estados;
5. revisar motion;
6. revisar accessibility;
7. añadir stories;
8. solo entonces exportarlo públicamente.
