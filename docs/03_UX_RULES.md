# UX Rules

## Gate de seguridad del build (`security-audit`)

El `prebuild` de la app corre `typecheck`, `lint` y `npm run security:verify`. Sin una auditoría vigente y limpia, `npm run build` no compila.

- `npm run security:audit` lanza la skill `security-audit` (Cloudflare) con un agente sin interfaz (`claude -p`; consume tokens de tu cuenta, por eso no corre en cada build) y copia la evidencia a `.security/` (`findings.json`, `run-metadata.json`, `coverage-ledger.json`, `REPORT.md`, `attestation.json`). Versiona `.security/` en git. Puedes reemplazar el comando con `IIMP_SECURITY_AUDIT_CMD`.
- `npm run security:verify` es determinista y no usa IA. Falla si: no hay `findings.json`; no pasa `validate-findings.cjs` de la skill; `run_status` no es `complete`; el hash de `src/`, `app/`, `pages/`, `next.config.*` o `package-lock.json` cambió desde la auditoría; hay algún hallazgo `confirmed`; o hay `needs_validation` sin aceptar.
- Un `confirmed` nunca se puede aceptar: se parcha y se vuelve a auditar. Un `needs_validation` solo se acepta en `.security/accepted.json` con `fingerprint`, `reason` (mínimo 10 caracteres) y `approvedBy`.
- `IIMP_SECURITY_GATE=skip` omite el gate solo en local y avisa en voz alta. El workflow de CI define `IIMP_SECURITY_GATE_LOCK=1`, que anula el skip.
- La skill es una revisión asistida por IA: que no encuentre nada no prueba que no haya vulnerabilidades. Complementa, no reemplaza, `npm audit`, secret scanning y CodeQL.

## Formularios en varias columnas

Los campos en la misma fila van en `<FormGrid>`: las columnas salen del ancho del contenedor (1 en un drawer, varias en una página) y los campos llenan la fila sin huecos. `FormField` alinea sus controles por filas aunque un vecino tenga descripción, error o etiqueta de dos líneas. Prohibido: `grid-cols-N`/`flex` en fila con `FormField` hermanos y anchos fraccionarios (`w-1/4`, `w-[25%]`, `basis-*`) en el campo o su contenedor; un campo que necesita fila propia usa `className="col-span-full"`. Reglas ESLint `iimp/form-grid`; ver `README.md` → "Formulario con varios campos".

## Tablas y logo del sidebar

- **Cabeceras de tabla:** `font-size: 12px` y `font-weight: bolder` en todas las tablas. Viven en `TableHead`; `DataTable` no las redefine y ESLint bloquea sobrescribirlas en `<TableHead>`. Se verifica en `e2e/table-head.spec.ts`.
- **Logo del sidebar:** `DashboardSidebarBrand` muestra el logo a 35px de alto y ancho automático (`h-[35px] w-auto`), dentro del recuadro de 48px. No uses `!important` ni CSS global sobre `[data-slot="dashboard-sidebar-brand"] img`. `logoClassName` puede reemplazar la altura (ej. `h-10`).
- El CSS precompilado del kit no usa `@layer`, así que gana al CSS en capa de Tailwind de la app: por eso estos valores se fijan en el componente y no con overrides externos.

## Botones: iconos y grupos (reglas ESLint `iimp/*`)

- Un `<Button>` con **solo icono** debe usar `size="icon"` (`icon-sm`/`icon-lg`) y llevar `aria-label`; si el significado no es obvio, envolverlo en `<Tooltip>`. Si hay espacio, preferir icono + texto. Regla `iimp/icon-button-label`.
- **Dos o más** `<Button>` contiguos del mismo nivel deben ir dentro de `<ButtonGroup>`. Excepciones: footers (`DialogFooter`, `CardFooter`…) y combinaciones Primary + otra variante, que son jerarquías distintas. Regla `iimp/prefer-button-group`.
- Ambas viven en `official-uikit-iimp/eslint` y fallan con `eslint . --max-warnings=0`. El `build` de las apps corre `prebuild` (`typecheck` + `lint`), así que un error de tipos o de estas reglas impide compilar.

```tsx
<ButtonGroup>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon" variant="outline" aria-label="Ver detalle">
        <EyeIcon />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Ver detalle</TooltipContent>
  </Tooltip>
  <Button size="icon" variant="outline" aria-label="Editar">
    <PencilIcon />
  </Button>
</ButtonGroup>
```

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

Los tamaños de los controles son los del preset shadcn `luma` (ver la sección "Base visual" al final). No se sobrescriben en las apps.

No todo elemento visual debe medir 44px; el **target interactivo** sí debe cumplir el estándar elegido.

## Jerarquía de acciones

Las variantes de `Button` expresan **jerarquía e intención**, no una preferencia de color. El color lo resuelve el theme; la variante se elige por el papel de la acción en el contexto actual.

En la API, `variant="default"` representa el rol semántico **Primary**. No existe una variante pública llamada `primary`.

### Contexto visual

Un contexto visual es una unidad de decisión comprensible por sí misma: un dialog, formulario, card, sección funcional, paso de wizard o panel de acciones. Como regla general, cada contexto debe tener como máximo una acción Primary dominante. Una página puede contener varias acciones Primary si pertenecen a contextos independientes.

### Variantes

| Variante            | Rol                                                                   | Usar para                                                                                       | Ejemplos                                                                 |
| ------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `default` (Primary) | Acción que completa o hace avanzar el objetivo principal del contexto | La única acción dominante del contexto                                                          | Guardar, Crear, Continuar, Confirmar, Enviar, Publicar                   |
| `secondary`         | Acción importante, visible y subordinada a Primary                    | Una alternativa relevante que necesita más énfasis que Outline                                  | Guardar borrador, Vista previa, Exportar cuando sea una acción relevante |
| `outline`           | Acción secundaria visible que no debe competir con Primary            | Alternativas, volver, configurar o cancelar cuando la salida debe permanecer claramente visible | Editar, Volver, Filtrar, Configurar, Cancelar                            |
| `ghost`             | Acción terciaria, auxiliar o contextual                               | Toolbars, tablas, icon buttons, cerrar, mostrar más o cancelar con bajo énfasis                 | Cerrar, Mostrar más, Limpiar filtros                                     |
| `destructive`       | Acción destructiva, irreversible o de alto impacto negativo           | Eliminar, anular, revocar o desactivar definitivamente                                          | Eliminar participante, Revocar acceso                                    |
| `link`              | Navegación o acción que debe leerse como enlace                       | Navegar a contenido relacionado o revelar una ruta textual                                      | Ver detalle, Consultar documentación                                     |

`destructive` no es el último peldaño de una escala visual: expresa riesgo. En una confirmación destructiva puede ser la acción dominante, pero nunca debe usarse como color decorativo o corporativo.

Cualquier superficie con `bg-secondary` debe llevar `text-secondary-foreground` (y lo mismo con `primary`): el foreground predomina sobre el color de marca, también en icono, hover y focus. No combinar `ghost`/`outline` con `bg-secondary` manual (hereda texto oscuro y el hover vuelve a `muted`); usar `variant="secondary"`.

No elegir `secondary` automáticamente porque exista un segundo botón. Dos acciones suelen resolverse como Primary + Outline o Primary + Ghost. Usar Primary + Secondary solo cuando la alternativa tenga importancia real dentro del mismo contexto.

Para `Cancelar` o `Cerrar`:

- usar `outline` cuando la salida segura deba ser claramente visible junto al CTA;
- usar `ghost` cuando sea una acción auxiliar o de baja jerarquía;
- no convertir esta elección en una regla basada únicamente en el texto del botón.

### Ejemplos correctos

```tsx
// Modal de creación: salida visible + acción dominante.
<Button variant="outline">Cancelar</Button>
<Button>Crear</Button>

// Formulario con una alternativa realmente importante.
<Button variant="ghost">Volver</Button>
<Button variant="secondary">Guardar borrador</Button>
<Button>Guardar y continuar</Button>

// Confirmación destructiva: destructive comunica riesgo y domina el contexto.
<Button variant="outline">Cancelar</Button>
<Button variant="destructive">Eliminar participante</Button>
```

### Incorrecto

```tsx
// Dos CTAs compiten dentro del mismo formulario.
<Button>Guardar borrador</Button>
<Button>Guardar y continuar</Button>

// Secondary elegido solo por ser el segundo botón.
<Button>Crear</Button>
<Button variant="secondary">Cerrar</Button>

// Destructive usado sin una consecuencia destructiva.
<Button variant="destructive">Ver reporte</Button>
```

### Auditoría y migración

- Antes de generar o auditar una vista, identificar la acción dominante y ordenar el resto por intención.
- Señalar primero las acciones que incumplen esta jerarquía antes de modificar una interfaz existente.
- Una corrección visual de variantes no debe cambiar permisos, lógica, routing, validaciones ni side effects.
- La jerarquía semántica depende del contexto y requiere revisión humana o del agente; no se considera completamente verificable mediante ESLint.

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

### Select vs. Combobox

- `Select`: listas cortas y fijas (hasta ~8-10 opciones), conocidas de antemano (estados, tipos de documento, monedas).
- `Combobox`: listas largas, que vienen de una API/base de datos, o donde el usuario probablemente busque escribiendo (proveedores, participantes, países, cualquier catálogo de decenas o cientos de registros). Trae buscador integrado, así que el usuario escribe en vez de desplazarse por toda la lista.
- Criterio práctico: si dudas, o la lista puede crecer con el tiempo, usa `Combobox`. Migrar un `Select` a `Combobox` más adelante implica rehacer el control; empezar con `Combobox` no cuesta nada de más.
- Esto es criterio de diseño, no una regla de ESLint: la cantidad de opciones casi siempre depende de datos en runtime (una lista de proveedores desde una API, por ejemplo), así que no se puede verificar de forma estática antes de ejecutar la app.

## AuthLayout (pantallas de login)

`AuthLayout` es el shell de dos columnas para pantallas de autenticación: panel de marca a la izquierda (oculto en mobile, con eyebrow/headline/descripción/features/footer por props) y el `children` — la card de login real — a la derecha. Mobile-first: en mobile el panel se convierte en una superficie de marca con nombre/tagline arriba de la card.

La prop `brandTone="primary" | "secondary"` decide qué pareja semántica pinta esa superficie. El valor por defecto es `primary`. No usar `className` para hardcodear otro color ni duplicar el layout: si una marca necesita otros valores, debe cambiar los tokens runtime.

**No implementa autenticación.** Solo da la estructura visual. El botón de Google (`GoogleSignInButton`, con el logo oficial de Google) tampoco hace login por sí solo: recibe `onClick`/`formAction` para que cada proyecto conecte su propio proveedor (NextAuth, Server Action, Firebase, lo que use).

Receta mínima:

```tsx
import {
  AuthLayout,
  GoogleSignInButton,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "official-uikit-iimp";

export default function LoginPage() {
  return (
    <AuthLayout
      brandTone="secondary"
      systemName="Nombre del sistema"
      systemTagline="Instituto de Ingenieros de Minas del Perú"
      eyebrow="Módulo o producto"
      headline="Resumen breve de qué hace el sistema."
      description="Una o dos frases sobre el problema que resuelve."
      features={["Beneficio clave", "Otra capacidad relevante"]}
      footer={`© ${new Date().getFullYear()} Instituto de Ingenieros de Minas del Perú`}
    >
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido de vuelta</CardTitle>
          <CardDescription>
            Inicia sesión con tu cuenta institucional.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Conecta tu propio proveedor de auth aquí */}
          <GoogleSignInButton formAction={miServerActionDeLogin} />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
```

Ver el pattern completo, con textos de enlaces legales incluidos, en Storybook: **Patterns → AuthLayout**.

## DashboardLayout (aplicaciones autenticadas)

`DashboardLayout` es el shell responsive posterior al login. Compone `SidebarProvider`, el sidebar de la app, un header y el landmark `<main>` que contiene cada ruta. No implementa navegación, sesión, permisos ni lógica de negocio.

Reglas:

- usar `DashboardLayout` en vez de repetir `AppLayout` o un shell manual por proyecto;
- construir la navegación con los primitives `Sidebar*` oficiales;
- usar `Sidebar collapsible="offcanvas"`; al cerrar, el sidebar sale completamente hacia la izquierda y el main recupera todo el ancho;
- usar `DashboardSidebarBrand` para marca/título/subtítulo y alinear su divisor con `DashboardHeader`;
- `DashboardSidebarBrand` muestra el logo PNG institucional en un recuadro blanco por defecto; para otra marca autorizada pasar `logoSrc` y `logoAlt`, no un icono por sistema;
- usar `DashboardSidebarUser` para nombre, email, avatar y salida; recibe `onSignOut` o `signOutAction` de la app;
- usar `DashboardHeader` para obtener `SidebarTrigger`, separación y distribución responsive estándar;
- usar `DashboardVersion` en `status` para mostrar la versión pública (`v0.0.1`), no mensajes operativos permanentes;
- usar `DashboardNotifications` para campana y Popover; la lista y conteo siguen perteneciendo a la app;
- usar `LanguageSwitcher` en el slot `languageSwitcher` si la app ofrece idiomas; queda a la izquierda de la campana;
- pasar breadcrumb/título en `navigation` y acciones de página en `actions`;
- usar `sidebarTone="primary" | "secondary" | "base"`; el valor por defecto es `primary`;
- mantener routing, estado activo, usuario y logout en la app consumidora;
- usar `contentClassName` solo para necesidades de layout del contenido, no para redefinir identidad visual.

`SidebarMenuButton` ya define 44px de alto y usa `--sidebar-menu-radius` (10px). No volver a definir esos valores en cada proyecto.

Receta mínima:

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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      sidebarTone="primary"
      sidebar={
        <Sidebar collapsible="offcanvas">
          <DashboardSidebarBrand
            title="Nombre del sistema"
            description="Nombre del módulo"
          />
          <SidebarContent>{/* navegación y estado activo */}</SidebarContent>
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
            <LanguageSwitcher
              languages={["es", "en", "qu"]}
              onValueChange={changeLocale}
            />
          }
          notifications={
            <DashboardNotifications count={alerts.length}>
              {/* lista */}
            </DashboardNotifications>
          }
          actions={<PageActions />}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
}
```

Cambiar el color del sidebar no requiere otra implementación:

```tsx
<DashboardLayout
  sidebarTone="secondary"
  sidebar={<AppSidebar />}
  header={<AppHeader />}
>
  {children}
</DashboardLayout>
```

Ver los tres tonos en Storybook: **Patterns → DashboardLayout**.

`LanguageSwitcher` es un menú con opciones exclusivas: selecciona el ISO, actualiza el trigger y emite `onValueChange` para el i18n de la aplicación. Para sistemas existentes puede usar `googleTranslate={{ sourceLanguage: "es" }}`; consulta la implementación, privacidad y retiro programado del servicio en [`17_LANGUAGE_SWITCHER.md`](./17_LANGUAGE_SWITCHER.md).

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

## Base visual: preset shadcn `b1aIuQ2XC` (v0.4)

El kit usa los componentes del preset de shadcn (estilo `luma`, base `stone`, iconos Remix), con estas decisiones propias de IIMP sobre esa base:

- `primary` `#092042` y `secondary` `#f2e8dd` con texto `#c09153` (contraste bajo, ~2.4:1: úsalo en texto grande o con icono).
- Charts y `sidebar-primary` derivan de esos dos colores.
- Tokens semánticos `success`, `warning` e `info` (variantes de `Badge`).
- **Radio 10px** (`--radius: 0.625rem`) en controles y contenedores. Los controles genuinamente circulares (Avatar, Switch, Radio, el segmented control de Tabs) siguen `rounded-full`; eso es forma, no esquina, y no cambia con el radio. Cards y diálogos usan un radio algo mayor (14px) derivado del mismo token.
- **Campos de formulario** (Input, Textarea, Select, Combobox, NativeSelect, InputOTP) con fondo blanco sólido, borde sutil (`border-input`) y `shadow-sm`; antes eran translúcidos.
- **Sombra base `shadow-sm`** en superficies en reposo (Card). Los menús flotantes mantienen `shadow-lg` y los modales `shadow-xl`: necesitan más elevación visual para separarse del contenido de atrás; aplanarlos a todos a `shadow-sm` los haría ver pegados a la página.
- **Tipografía de cuerpo:** `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` (resuelve a San Francisco en Mac/iOS, Segoe UI en Windows). Los títulos siguen en SF Pro Display, mínimo 20px; el texto mínimo del kit es 13px, con una excepción deliberada: las cabeceras de tabla (`TableHead`) usan `font-size: 12px` y `font-weight: bolder`, sin sobrescribirse.
- **Todo control interactivo mide mínimo 40px de alto** (Button, Input, Select, Combobox, Toggle, Tabs, Menubar, NavigationMenu, Sidebar, Breadcrumb). Checkbox/Radio/Switch mantienen su caja visual pequeña (así se ven en cualquier sistema), pero exponen un área de clic invisible de 40px o más.
- **Iconos: mínimo 24×24px.** Excepciones documentadas, siempre por una razón física (no cabrían) o semántica (son chrome decorativo junto a texto, no "un icono"): el check dentro de Checkbox/Radio, el icono de un `Badge`, `Kbd`, el caret de disclosure de `NavigationMenuTrigger`/el dropdown de mes-año del `Calendar`, el separador/ellipsis de `Breadcrumb`, la acción de `SidebarMenuAction` (20px) y el glifo `icon-xs` de `Button`/`InputGroupButton` (nace para vivir dentro de un campo o chip ya de 40px).
- `IimpThemeProvider` cambia primary/secondary/radio en runtime.
