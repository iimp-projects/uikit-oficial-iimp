# official-uikit-iimp

UI Kit oficial de Eventos IIMP. Basado en shadcn/ui y Tailwind CSS. Incluye **primitives** (Button, Input, Select, Dialog…) y **patterns** (FormField, DataTable, ConfirmDialog…) ya alineados con los tokens, la accesibilidad (targets de 44px) y el theming de IIMP.

> Regla principal: las apps **componen** con este kit. No crean un sistema visual paralelo ni usan `<button>`, `<input>`, `<select>` o `<textarea>` nativos.

## Empieza aquí — elige solo una ruta

No necesitas instalar todo manualmente ni copiar archivos de este repositorio.

1. **Vas a crear un proyecto nuevo:** usa el [starter oficial](https://github.com/iimp-projects/uikit-oficial-iimp/tree/main/templates/next-starter). Crea el proyecto, ejecuta `npm run setup` una vez y luego trabaja normalmente.
2. **Ya tienes un proyecto Next.js:** ejecuta el [CLI de adopción en npm](https://www.npmjs.com/package/@nrivera-iimp/adopt) primero con `--dry-run`. Te dice qué cambiaría antes de tocar archivos.
3. **Solo necesitas componentes o tokens en una app existente:** instala el [UI Kit en npm](https://www.npmjs.com/package/official-uikit-iimp).

Este repositorio es la fuente de verdad: [ver código, documentación y starter en GitHub](https://github.com/iimp-projects/uikit-oficial-iimp).

## Mapa de artefactos y documentación

El estándar se distribuye en tres piezas complementarias; no son tres shells visuales:

| Artefacto | Uso | Estado de distribución | Documentación |
| --- | --- | --- | --- |
| [`official-uikit-iimp`](https://www.npmjs.com/package/official-uikit-iimp) | Componentes, tokens, patterns y configuración strict compartida. | Publicado en npm (`0.8.3`). | Este README |
| [`templates/next-starter`](https://github.com/iimp-projects/uikit-oficial-iimp/tree/main/templates/next-starter) | Boilerplate Git para aplicaciones Next.js nuevas. | Vive en este repositorio y se consume con `create-next-app --example`. | [README del starter](./templates/next-starter/README.md) |
| [`@nrivera-iimp/adopt`](https://www.npmjs.com/package/@nrivera-iimp/adopt) | CLI para adoptar el estándar en una aplicación existente. | Publicado en npm (`0.1.1`). | [README del CLI](./packages/adopt/README.md) |

La guía que conecta las tres piezas, sus límites y la ruta para proyectos nuevos o existentes está en [Bootstrap y adopción](https://github.com/iimp-projects/uikit-oficial-iimp/blob/main/docs/16_PROJECT_BOOTSTRAP.md). Las reglas visuales y técnicas viven en [`docs/`](./docs/).

## 1. Instalación

```bash
npm install official-uikit-iimp
```

Requiere React 19 y react-dom 19.

### Proyectos nuevos: starter oficial

```bash
npx create-next-app@latest \
  --example "https://github.com/iimp-projects/uikit-oficial-iimp" \
  --example-path templates/next-starter \
  mi-proyecto

cd mi-proyecto
npm run setup
npm run check
```

El starter incluye Next.js App Router, Tailwind v4, TypeScript estricto, ESLint sin warnings, tests, CI, seguridad base y la instalación idempotente de skills. Consulta [`templates/next-starter/README.md`](./templates/next-starter/README.md).

El starter depende de `@nrivera-iimp/adopt` para `npm run setup`. La dependencia se instala desde npm y el comando es público.

### Actualizar una aplicación existente

Actualizar el paquete no modifica tus archivos de aplicación: solo reemplaza el contenido de `node_modules`. Actualiza en una rama, valida y adopta los nuevos patterns cuando tú lo decidas:

```bash
npm install official-uikit-iimp@0.8.3 --save-exact
npm run check
```

La versión 0.8 añade `DashboardVersion`, mejora la truncación de breadcrumbs y convierte `LanguageSwitcher` en un menú accesible. `DashboardSidebarBrand` muestra el logo institucional por defecto. El prop anterior `icon` continúa por compatibilidad, pero está deprecado; reemplázalo gradualmente por `logoSrc`/`logoAlt` solo cuando realmente exista otra marca autorizada.

### Proyectos existentes: CLI de adopción

El CLI público instala y aplica el estándar sin copiar el boilerplate sobre una aplicación existente:

```bash
npx @nrivera-iimp/adopt@latest --dry-run
npx @nrivera-iimp/adopt@latest
```

Para desarrollar o validar el CLI directamente desde este repositorio:

```bash
npm install
node packages/adopt/bin/iimp-adopt.mjs --dry-run --cwd /ruta/a/tu-proyecto
```

El primer comando solo analiza. El segundo conecta el proyecto al estándar, instala las skills faltantes y genera `.iimp/ADOPTION_REPORT.md`. No actualiza una versión mayor de Next.js ni sobrescribe skills existentes silenciosamente. Consulta [`packages/adopt/README.md`](./packages/adopt/README.md).

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
import "official-uikit-iimp/style.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

El paquete se distribuye con la directiva `"use client"`, así que puedes importar los componentes desde cualquier archivo.

### Vite

```tsx
// src/main.tsx
import "official-uikit-iimp/style.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

Sin más configuración, la app ya usa los colores por defecto de IIMP. El provider de tema (sección 4) es opcional.

## 2. Componentes

Antes de crear UI: busca un **pattern**; si no hay, un **primitive**; si no alcanza, extiende el kit (no lo dupliques en tu app).

### Patterns (composiciones listas)

| Componente           | Cuándo usarlo                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PageHeader`         | Título de página con descripción, breadcrumb y acciones.                                                                                                     |
| `FormField`          | Un campo con label, descripción, error y marca de obligatorio. Envuelve un `Input`, `Select`, etc.                                                           |
| `FormSection`        | Agrupar campos relacionados bajo un título.                                                                                                                  |
| `SearchField`        | Búsqueda con debounce (300 ms por defecto).                                                                                                                  |
| `FilterBar`          | Barra de filtros con contador de filtros activos y botón "Limpiar filtros".                                                                                  |
| `DataCard`           | Card de pantallas de datos: título, contador, acciones (búsqueda/filtros) y tabla a todo el ancho.                                                           |
| `DataTable`          | Tabla de datos con carga (skeleton), estado vacío y click en fila.                                                                                           |
| `StatCard`           | Métrica con valor, tendencia (`up`/`down`), texto de apoyo (`hint`) e icono.                                                                                 |
| `StatusBadge`        | Estado de un registro: `success`, `warning`, `destructive`, `info`, `default`, `secondary`.                                                                  |
| `EmptyState`         | Cuando no hay datos: título, descripción y hasta dos acciones.                                                                                               |
| `ErrorState`         | Error de página (`page`) o de bloque (`inline`) con botón de reintento.                                                                                      |
| `LoadingState`       | Carga con `spinner` o `skeleton`.                                                                                                                            |
| `ConfirmDialog`      | Confirmar una acción normal (guardar, enviar).                                                                                                               |
| `DestructiveDialog`  | Confirmar una acción destructiva. Usa un verbo específico ("Eliminar participante"), nunca "Aceptar".                                                        |
| `FormDialog`         | Formulario dentro de un diálogo, con botones cancelar y enviar.                                                                                              |
| `InfoDialog`         | Mostrar información sin acción.                                                                                                                              |
| `AuthLayout`         | Shell de login (panel de marca + tu propia card). `brandTone` permite `primary` o `secondary`. No implementa autenticación.                                  |
| Familia `Dashboard*` | Shell autenticado con sidebar responsive, logo institucional, usuario/logout, versión, header, notificaciones y main libre. `sidebarTone` permite `primary`, `secondary` o `base`. |
| `LanguageSwitcher` | Menú compacto de idiomas por códigos ISO/BCP 47. Puede notificar a tu i18n o, temporalmente, escribir la cookie de Google Translate. |

### Primitives

Button, GoogleSignInButton, Input, Textarea, Select, NativeSelect, Combobox, Checkbox, RadioGroup, Switch, Slider, Toggle, ToggleGroup, InputOTP, Calendar, Label, Field, InputGroup, Card, Table, Tabs, Accordion, Collapsible, Separator, ScrollArea, Resizable, Avatar, Badge, Alert, Progress, Skeleton, Spinner, Kbd, Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Breadcrumb, Pagination, Sidebar, Command, Carousel, Chart, Sonner (`Toaster`), y componentes de chat (Message, Bubble, MessageScroller, Attachment, Questionnaire).

Todos se importan de `official-uikit-iimp`. Los tipos incluyen la documentación de props en tu editor.

> **`Select` vs. `Combobox`:** usa `Select` solo para listas cortas y fijas (hasta ~8-10 opciones). Para listas largas, que vienen de una API, o donde el usuario probablemente busque escribiendo, usa `Combobox` — trae buscador integrado. Ver `docs/03_UX_RULES.md`.

## 3. Recetas

### Shell autenticado

```tsx
import {
  DashboardHeader,
  DashboardLayout,
  LanguageSwitcher,
  DashboardNotifications,
  DashboardSidebarBrand,
  DashboardSidebarUser,
  DashboardVersion,
  Sidebar,
  SidebarContent,
} from "official-uikit-iimp";

<DashboardLayout
  sidebarTone="primary"
  sidebar={
    <Sidebar collapsible="offcanvas">
      <DashboardSidebarBrand title="Sistema IIMP" />
      <SidebarContent>
        <AppNavigation />
      </SidebarContent>
      <DashboardSidebarUser
        name={user.name}
        email={user.email}
        signOutAction={logout}
      />
    </Sidebar>
  }
  header={
    <DashboardHeader
      navigation={<AppBreadcrumb />}
      status={<DashboardVersion version={appVersion} />}
      languageSwitcher={
        <LanguageSwitcher languages={["es", "en", "qu"]} onValueChange={changeLocale} />
      }
      notifications={<DashboardNotifications count={alerts.length} />}
      actions={<PageActions />}
    />
  }
>
  {children}
</DashboardLayout>;
```

`AppSidebar` compone los primitives `Sidebar*` oficiales. Routing, permisos, sesión, navegación y logout permanecen en la app. Ver receta completa en `docs/03_UX_RULES.md`.

`DashboardSidebarBrand` usa por defecto el logo PNG institucional en un recuadro blanco. Si un producto autorizado necesita otra marca, pasa `logoSrc` y `logoAlt`; no hace falta crear ni mantener iconos por sistema.

### Idioma y Google Translate

`LanguageSwitcher` crea un menú accesible desde los códigos que recibe y se ubica inmediatamente a la izquierda de la campana cuando se pasa mediante `DashboardHeader.languageSwitcher`. Al seleccionar, actualiza su estado y emite `onValueChange`; la integración recomendada es conectarlo al proveedor i18n de la aplicación.

Para una integración existente con Google Website Translator, activa su bridge de cookie:

```tsx
<LanguageSwitcher
  languages={["es", "en", "qu"]}
  googleTranslate={{ sourceLanguage: "es" }}
/>
```

El componente añade el objetivo oculto que requiere Google, carga el script una vez si aún no existe, guarda `googtrans`, recarga la página y oculta automáticamente el banner/iframe superior que Google inyecta en `<body>` (no hace falta CSS propio para eso). Es una compatibilidad temporal: consulta la guía completa de props, el bridge y solución de problemas en [`docs/17_LANGUAGE_SWITCHER.md`](./docs/17_LANGUAGE_SWITCHER.md).

### Formulario

```tsx
import {
  Button,
  FormField,
  FormSection,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "official-uikit-iimp";

export function ParticipanteForm() {
  return (
    <form className="flex flex-col gap-6">
      <FormSection
        title="Datos personales"
        description="Se usan para la acreditación."
      >
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
  );
}
```

`FormField` recibe **un solo hijo** (`children: ReactElement`) y le asocia label, descripción y error.

### Tabla con filtros, carga y estado vacío

```tsx
import { useState } from "react";
import {
  DataTable,
  EmptyState,
  FilterBar,
  PageHeader,
  SearchField,
  StatusBadge,
} from "official-uikit-iimp";

type Participante = {
  id: number;
  nombre: string;
  estado: "success" | "warning";
};

export function Participantes({
  data,
  loading,
}: {
  data: Participante[];
  loading: boolean;
}) {
  const [query, setQuery] = useState("");
  const rows = data.filter((p) =>
    p.nombre.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader title="Participantes" description="Inscritos al evento" />
      <FilterBar activeCount={query ? 1 : 0} onClear={() => setQuery("")}>
        <SearchField
          value={query}
          onSearch={setQuery}
          placeholder="Buscar participante…"
        />
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
            cell: (row) => (
              <StatusBadge status={row.estado}>
                {row.estado === "success" ? "Confirmado" : "Pendiente"}
              </StatusBadge>
            ),
          },
        ]}
        emptyState={
          <EmptyState
            title="Sin participantes"
            description="Prueba con otra búsqueda."
          />
        }
      />
    </>
  );
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

Por defecto el kit usa el preset de shadcn `b1aIuQ2XC` (estilo luma, iconos Remix) con las decisiones de IIMP: colores primary `#092042` y secondary `#f2e8dd` con texto `#c09153`; **radio de 10px** en controles y ~14px en cards (los controles circulares como Switch, Radio o Avatar siguen `rounded-full`); campos de formulario con fondo blanco sólido y borde sutil; sombra `shadow-sm` en superficies en reposo (los menús y modales mantienen más elevación); y tipografía de cuerpo con la pila `system-ui` (San Francisco en Mac/iOS, Segoe UI en Windows, mínimo 13px) con títulos en **SF Pro Display** (mínimo 20px).

Para cambiar colores o radio por vertical, envuelve la app:

```tsx
import { IimpThemeProvider } from "official-uikit-iimp";

<IimpThemeProvider
  theme={{
    primary: "#092042",
    secondary: "#f2e8dd",
    secondaryForeground: "#c09153", // par de marca
    radius: "0.625rem",
  }}
>
  <App />
</IimpThemeProvider>;
```

- `primary` y `secondary` son obligatorios dentro de `theme`; `radius`, `primaryForeground` y `secondaryForeground` son opcionales.
- Si no envías un foreground, se calcula automáticamente por contraste (blanco u oscuro, el de mayor ratio). Si cambias `secondary` y quieres conservar el texto `#c09153`, pásalo explícitamente.
- **Accesibilidad:** el par de marca `#c09153` sobre `#f2e8dd` tiene un contraste de ~2.4:1 y no cumple WCAG AA (4.5:1) para texto normal. Úsalo en texto grande o acompañado de icono/borde.
- No hardcodees colores de marca (`#hex`, `rgb()`) ni escribas reglas por vertical (`if (vertical === "perumin")`): todo pasa por el `theme`.

### Densidad y números

Todo el kit está en `rem` con raíz de 16px (tamaño original de shadcn). Para escalarlo, define `--iimp-root-font-size` (ej. `106%`). Los números salen con cifras alineadas a la línea base (`lining-nums`) y las tablas con `tabular-nums`.

### Fondos y líneas

Los componentes (Input, Select, Card, Popover…) traen **fondo blanco sólido** por defecto. Para cambiarlo pasa `className`:

```tsx
<Card className="bg-muted">…</Card>
```

Para separar secciones usa `<Separator />` o la clase `border-border` (línea fina de 1px). Si en tu app escribes `border-b` a secas, Tailwind lo pinta con el color del texto (negro). Añade siempre `border-border`.

## 5. Jerarquía de botones

Las variantes representan intención y jerarquía, no colores corporativos. `variant="default"` es la acción Primary dominante del contexto; `secondary` es una alternativa importante subordinada, no “el segundo botón”; `outline` mantiene visible una acción menor; `ghost` sirve para acciones auxiliares; y `destructive` se reserva para consecuencias destructivas o irreversibles.

Como regla general, usa como máximo un Primary dominante por dialog, formulario, card, sección funcional, paso de wizard o panel de acciones. Una página puede tener varios si pertenecen a contextos independientes. Consulta ejemplos correctos, incorrectos y el criterio para `Cancelar`/`Cerrar` en `docs/03_UX_RULES.md` → “Jerarquía de acciones”.

## 6. Guardrails de ESLint (recomendado)

```js
// eslint.config.js de la app consumidora
import { iimpGuardrails } from "official-uikit-iimp/eslint";

export default [
  // ...tu config existente
  ...iimpGuardrails,
];
```

El maquetado se hace **siempre con el componente equivalente del kit** (shadcn/ui), no con HTML nativo. El linter falla y te dice cuál usar:

| En vez de                             | Usa                                     |
| ------------------------------------- | --------------------------------------- |
| `<button>`                            | `Button`                                |
| `<input>` / `<select>` / `<textarea>` | `Input` / `Select` / `Textarea`         |
| `<label>`                             | `Label` o `FormField`                   |
| `<table>`, `<tr>`, `<td>`…            | `Table` o `DataTable`                   |
| `<hr>`                                | `Separator`                             |
| `<progress>`                          | `Progress`                              |
| `<dialog>`                            | `Dialog`, `ConfirmDialog`, `FormDialog` |
| `<details>`                           | `Accordion` / `Collapsible`             |

Además bloquea `className` con bordes sin color (`border-b` a secas se pinta negro; usa `border-border` o `Separator`), imports directos de Radix/Base UI/shadcn, rutas internas del paquete e imports de copias locales de `AuthLayout` o la familia `Dashboard*` oficial.

### Perfil completo “zero errors” para Next.js

```js
// eslint.config.mjs
import iimpNextStrict from "official-uikit-iimp/eslint/next-strict";

export default iimpNextStrict;
```

```json
{
  "extends": "official-uikit-iimp/tsconfig/next-strict.json"
}
```

Ejecuta ESLint con `--max-warnings=0` y usa un quality gate que incluya formato, typecheck, lint, pruebas y build. La arquitectura completa está documentada en [`docs/16_PROJECT_BOOTSTRAP.md`](./docs/16_PROJECT_BOOTSTRAP.md).

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md), `AGENTS.md` y `docs/`.
