# Storybook Specification

Storybook será el catálogo oficial del UI Kit.

## Foundations

Crear secciones:
- Colors
- Typography
- Spacing
- Radius
- Shadows
- Motion
- Accessibility
- Icons

## Components

Una story/page por primitive relevante.

Documentar:
- propósito,
- variants,
- sizes,
- states,
- uso,
- accessibility,
- do/don't.

## Patterns

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

## Theme Playground

Toolbar/control global:

```text
Primary
Secondary
Radius
Mode (si existe)
```

Debe actualizar todos los componentes en runtime.

## Required state stories

Cuando aplique:
- Default
- Hover/interaction demo
- Focus
- Disabled
- Loading
- Error
- Readonly
- Long content
- Mobile

## "Kitchen Sink"

Crear una página demo que combine:
- form,
- cards,
- tabs,
- table,
- dialog,
- toast,
- badges.

Sirve para detectar inconsistencias sistémicas.

## No business data

Usar fixtures genéricas. Storybook no depende del backend de Eventos IIMP.
