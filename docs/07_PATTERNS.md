# Patterns

Patterns = composiciones de primitives que representan una intención UX repetible.

## 1. FormDialog

Uso:
- crear,
- editar,
- configurar.

Anatomía:

```text
Header
  Title
  Description?
Body
  Form fields
Footer
  Cancel
  Primary action
```

Reglas:
- header consistente;
- body scrollable si excede viewport;
- footer estable;
- no iconos decorativos arbitrarios;
- submit con loading;
- preservar ancho del CTA al cargar.

## 2. InfoDialog

Uso:
- detalle,
- explicación,
- información no destructiva.

Generalmente:
- una acción `Cerrar`;
- evitar footer complejo.

## 3. ConfirmDialog

Uso:
- confirmar una acción relevante no destructiva.

Copy:
- título específico;
- consecuencia explícita;
- botones con verbos reales.

## 4. DestructiveDialog

Uso:
- eliminar,
- anular,
- revocar,
- operación irreversible.

Debe:
- usar semántica destructive;
- no usar primary brand como si fuera acción rutinaria;
- explicar impacto.

## 5. FormField

API conceptual:

```tsx
<FormField
  label="Nombre"
  required
  description="..."
  error="..."
>
  <Input />
</FormField>
```

Responsabilidad:
- label,
- description,
- error,
- ids/accessibility,
- spacing,
- required indicator.

## 6. FormSection

Agrupa campos relacionados.

Evitar Cards anidadas innecesarias como único mecanismo de agrupación.

## 7. DataTable

Debe estandarizar cuando aplique:
- columns,
- row actions,
- loading,
- empty state,
- pagination,
- sorting,
- filtering,
- search,
- selection.

No introducir todas las features en cada tabla; API composable.

## 8. PageHeader

Anatomía:

```text
Title
Description?
Breadcrumb? (si producto lo usa)
Actions
```

Debe resolver responsive wrapping.

## 9. EmptyState

Debe permitir:
- title,
- description,
- media/icon opcional,
- primary action opcional,
- secondary action opcional.

## 10. LoadingState

Definir cuándo usar:
- skeleton,
- spinner,
- progress.

Evitar spinner gigante para toda situación.

## 11. ErrorState

Debe distinguir:
- error de campo,
- error local,
- error de página,
- retry cuando proceda.

## 12. StatCard

Uso:
- KPI.
No usar para cualquier bloque visual.

## 13. StatusBadge

Mapea estados del dominio a variantes semánticas sin hardcodear color en cada feature.

Ejemplo conceptual:

```tsx
<StatusBadge status="active" />
```

El mapeo de negocio puede residir en la app si los estados son específicos del dominio; el UI Kit define estilos semánticos.

## Creación de nuevos patterns

Antes de crear:
1. demostrar repetición real;
2. definir intención UX;
3. documentar anatomy;
4. documentar variants;
5. documentar responsive;
6. documentar accessibility;
7. crear Storybook.
