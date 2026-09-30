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
- submit como acción Primary dominante y cancelar como `outline` o `ghost` según la visibilidad que necesite la salida segura;
- no iconos decorativos arbitrarios;
- submit con loading;
- preservar ancho del CTA al cargar.

## 2. InfoDialog

Uso:
- detalle,
- explicación,
- información no destructiva.

Generalmente:
- una acción `Cerrar` de baja jerarquía (`outline` o `ghost` según el contexto);
- evitar footer complejo.

## 3. ConfirmDialog

Uso:
- confirmar una acción relevante no destructiva.

Copy:
- título específico;
- consecuencia explícita;
- botones con verbos reales.

La confirmación no destructiva es la acción Primary del dialog; cancelar no debe competir con ella.

## 4. DestructiveDialog

Uso:
- eliminar,
- anular,
- revocar,
- operación irreversible.

Debe:
- usar semántica destructive;
- usar `destructive` como acción dominante del dialog, no `default`/Primary por color de marca;
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

Los nombres de props describen prioridad conceptual: la presentación debe respetar la jerarquía de `03_UX_RULES.md` y no implica que toda `secondaryAction` deba renderizar `variant="secondary"`.

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

## 14. AuthLayout

Shell responsive para autenticación:

```text
Desktop: Brand panel | App-owned login card
Mobile: Branded surface + system name + app-owned login card
```

Reglas:

- no contiene autenticación ni estado de sesión;
- `children` contiene la card y controles oficiales;
- `brandTone` acepta `primary` o `secondary`; usa `primary` por defecto;
- el cambio de tono consume la pareja foreground correspondiente;
- no duplicar el pattern para cambiar colores o copy.

## 15. DashboardLayout

Shell responsive para aplicaciones autenticadas:

```text
DashboardLayout
├─ Sidebar collapsible="offcanvas"
│  ├─ DashboardSidebarBrand
│  ├─ navegación (primitives Sidebar*)
│  └─ DashboardSidebarUser
└─ Main
   ├─ DashboardHeader + LanguageSwitcher + DashboardNotifications
   └─ Route content
```

Responsabilidad del pattern:

- `SidebarProvider` y comportamiento responsive;
- landmark principal mediante `SidebarInset`;
- header estándar con `SidebarTrigger`;
- altura alineada entre `DashboardSidebarBrand` y `DashboardHeader`;
- footer estándar de identidad y salida;
- campana accesible con Popover de notificaciones;
- selector de idioma opcional inmediatamente antes de la campana;
- logo institucional PNG por defecto en el bloque de marca;
- cierre desktop tipo off-canvas: el sidebar desaparece y el main recupera todo el ancho;
- gutters y ancho seguro del contenido;
- traducción de `sidebarTone` a tokens `sidebar-*`.

Responsabilidad de la app:

- rutas, breadcrumbs y estado activo;
- permisos y sesión;
- estructura de navegación;
- usuario, notificaciones, logout y acciones;
- contenido de cada página.

`sidebarTone` acepta `primary`, `secondary` o `base`; usa `primary` por defecto. La app no debe copiar el shell ni hardcodear colores para obtener otra apariencia.

## Creación de nuevos patterns

Antes de crear:
1. demostrar repetición real;
2. definir intención UX;
3. documentar anatomy;
4. documentar variants;
5. documentar responsive;
6. documentar accessibility;
7. crear Storybook.
