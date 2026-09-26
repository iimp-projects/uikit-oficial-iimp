# official-uikit-iimp

UI Kit oficial de Eventos IIMP. Basado en shadcn/ui y Tailwind CSS. Incluye **primitives** (Button, Input, Select, Dialog…) y **patterns** (FormField, DataTable, ConfirmDialog…) ya alineados con los tokens, la accesibilidad (targets de 44px) y el theming de IIMP.

> Regla principal: las apps **componen** con este kit. No crean un sistema visual paralelo ni usan `<button>`, `<input>`, `<select>` o `<textarea>` nativos.

## 1. Instalación

```bash
npm install official-uikit-iimp
```

Requiere React 19 y react-dom 19.

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
import "official-uikit-iimp/style.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

El paquete se distribuye con la directiva `"use client"`, así que puedes importar los componentes desde cualquier archivo.

### Vite

```tsx
// src/main.tsx
import "official-uikit-iimp/style.css"
import { createRoot } from "react-dom/client"
import App from "./App"

createRoot(document.getElementById("root")!).render(<App />)
```

Sin más configuración, la app ya usa los colores por defecto de IIMP. El provider de tema (sección 4) es opcional.

## 2. Componentes

Antes de crear UI: busca un **pattern**; si no hay, un **primitive**; si no alcanza, extiende el kit (no lo dupliques en tu app).

### Patterns (composiciones listas)

| Componente | Cuándo usarlo |
|---|---|
| `PageHeader` | Título de página con descripción, breadcrumb y acciones. |
| `FormField` | Un campo con label, descripción, error y marca de obligatorio. Envuelve un `Input`, `Select`, etc. |
| `FormSection` | Agrupar campos relacionados bajo un título. |
| `SearchField` | Búsqueda con debounce (300 ms por defecto). |
| `FilterBar` | Barra de filtros con contador de filtros activos y botón "Limpiar filtros". |
| `DataCard` | Card de pantallas de datos: título, contador, acciones (búsqueda/filtros) y tabla a todo el ancho. |
| `DataTable` | Tabla de datos con carga (skeleton), estado vacío y click en fila. |
| `StatCard` | Métrica con valor, tendencia (`up`/`down`), texto de apoyo (`hint`) e icono. |
| `StatusBadge` | Estado de un registro: `success`, `warning`, `destructive`, `info`, `default`, `secondary`. |
| `EmptyState` | Cuando no hay datos: título, descripción y hasta dos acciones. |
| `ErrorState` | Error de página (`page`) o de bloque (`inline`) con botón de reintento. |
| `LoadingState` | Carga con `spinner` o `skeleton`. |
| `ConfirmDialog` | Confirmar una acción normal (guardar, enviar). |
| `DestructiveDialog` | Confirmar una acción destructiva. Usa un verbo específico ("Eliminar participante"), nunca "Aceptar". |
| `FormDialog` | Formulario dentro de un diálogo, con botones cancelar y enviar. |
| `InfoDialog` | Mostrar información sin acción. |

### Primitives

Button, Input, Textarea, Select, NativeSelect, Combobox, Checkbox, RadioGroup, Switch, Slider, Toggle, ToggleGroup, InputOTP, Calendar, Label, Field, InputGroup, Card, Table, Tabs, Accordion, Collapsible, Separator, ScrollArea, Resizable, Avatar, Badge, Alert, Progress, Skeleton, Spinner, Kbd, Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Breadcrumb, Pagination, Sidebar, Command, Carousel, Chart, Sonner (`Toaster`), y componentes de chat (Message, Bubble, MessageScroller, Attachment, Questionnaire).

Todos se importan de `official-uikit-iimp`. Los tipos incluyen la documentación de props en tu editor.

## 3. Recetas

### Formulario

```tsx
import { Button, FormField, FormSection, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "official-uikit-iimp"

export function ParticipanteForm() {
  return (
    <form className="flex flex-col gap-6">
      <FormSection title="Datos personales" description="Se usan para la acreditación.">
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
  )
}
```

`FormField` recibe **un solo hijo** (`children: ReactElement`) y le asocia label, descripción y error.

### Tabla con filtros, carga y estado vacío

```tsx
import { useState } from "react"
import { DataTable, EmptyState, FilterBar, PageHeader, SearchField, StatusBadge } from "official-uikit-iimp"

type Participante = { id: number; nombre: string; estado: "success" | "warning" }

export function Participantes({ data, loading }: { data: Participante[]; loading: boolean }) {
  const [query, setQuery] = useState("")
  const rows = data.filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <PageHeader title="Participantes" description="Inscritos al evento" />
      <FilterBar activeCount={query ? 1 : 0} onClear={() => setQuery("")}>
        <SearchField value={query} onSearch={setQuery} placeholder="Buscar participante…" />
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
            cell: (row) => <StatusBadge status={row.estado}>{row.estado === "success" ? "Confirmado" : "Pendiente"}</StatusBadge>,
          },
        ]}
        emptyState={<EmptyState title="Sin participantes" description="Prueba con otra búsqueda." />}
      />
    </>
  )
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

Por defecto el kit usa el preset de shadcn `b1aIuQ2XC` (estilo luma, radio `0.875rem`, fuente Raleway, iconos Remix) con los colores de IIMP: primary `#092042`, secondary `#f2e8dd` con texto `#c09153`. Los tamaños (alturas, texto, espaciado) son los de shadcn.

Para cambiar colores o radio por vertical, envuelve la app:

```tsx
import { IimpThemeProvider } from "official-uikit-iimp"

<IimpThemeProvider
  theme={{
    primary: "#092042",
    secondary: "#f2e8dd",
    secondaryForeground: "#c09153", // par de marca
    radius: "0.625rem",
  }}
>
  <App />
</IimpThemeProvider>
```

- `primary` y `secondary` son obligatorios dentro de `theme`; `radius`, `primaryForeground` y `secondaryForeground` son opcionales.
- Si no envías un foreground, se calcula automáticamente por contraste (blanco u oscuro, el de mayor ratio). Si cambias `secondary` y quieres conservar el texto `#c09153`, pásalo explícitamente.
- **Accesibilidad:** el par de marca `#c09153` sobre `#f2e8dd` tiene un contraste de ~2.4:1 y no cumple WCAG AA (4.5:1) para texto normal. Úsalo en texto grande o acompañado de icono/borde.
- No hardcodees colores de marca (`#hex`, `rgb()`) ni escribas reglas por vertical (`if (vertical === "perumin")`): todo pasa por el `theme`.

### Densidad y números

El kit fija `html { font-size: 112.5% }` (root de 18px) para que todo, que está en `rem`, se vea ~12% más grande que el preset base sin perder proporciones. Para cambiarlo, define `--iimp-root-font-size` (ej. `100%` para el tamaño original de shadcn). Los números salen con cifras alineadas a la línea base (`lining-nums`) y las tablas con `tabular-nums`, porque Raleway usa por defecto cifras de texto.

### Fondos y líneas

Los componentes (Input, Select, Card, Popover…) traen **fondo blanco sólido** por defecto. Para cambiarlo pasa `className`:

```tsx
<Card className="bg-muted">…</Card>
```

Para separar secciones usa `<Separator />` o la clase `border-border` (línea fina de 1px). Si en tu app escribes `border-b` a secas, Tailwind lo pinta con el color del texto (negro). Añade siempre `border-border`.

## 5. Guardrails de ESLint (recomendado)

```js
// eslint.config.js de la app consumidora
import { iimpGuardrails } from "official-uikit-iimp/eslint"

export default [
  // ...tu config existente
  ...iimpGuardrails,
]
```

El maquetado se hace **siempre con el componente equivalente del kit** (shadcn/ui), no con HTML nativo. El linter falla y te dice cuál usar:

| En vez de | Usa |
|---|---|
| `<button>` | `Button` |
| `<input>` / `<select>` / `<textarea>` | `Input` / `Select` / `Textarea` |
| `<label>` | `Label` o `FormField` |
| `<table>`, `<tr>`, `<td>`… | `Table` o `DataTable` |
| `<hr>` | `Separator` |
| `<progress>` | `Progress` |
| `<dialog>` | `Dialog`, `ConfirmDialog`, `FormDialog` |
| `<details>` | `Accordion` / `Collapsible` |

Además bloquea `className` con bordes sin color (`border-b` a secas se pinta negro; usa `border-border` o `Separator`) y los imports directos de Radix, Base UI, shadcn o rutas internas del paquete.

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md), `AGENTS.md` y `docs/`.
