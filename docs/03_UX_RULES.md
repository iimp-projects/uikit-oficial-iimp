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

Los tamaños de los controles son los del preset shadcn `luma` (ver la sección "Base visual" al final). No se sobrescriben en las apps.

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

### Select vs. Combobox

- `Select`: listas cortas y fijas (hasta ~8-10 opciones), conocidas de antemano (estados, tipos de documento, monedas).
- `Combobox`: listas largas, que vienen de una API/base de datos, o donde el usuario probablemente busque escribiendo (proveedores, participantes, países, cualquier catálogo de decenas o cientos de registros). Trae buscador integrado, así que el usuario escribe en vez de desplazarse por toda la lista.
- Criterio práctico: si dudas, o la lista puede crecer con el tiempo, usa `Combobox`. Migrar un `Select` a `Combobox` más adelante implica rehacer el control; empezar con `Combobox` no cuesta nada de más.
- Esto es criterio de diseño, no una regla de ESLint: la cantidad de opciones casi siempre depende de datos en runtime (una lista de proveedores desde una API, por ejemplo), así que no se puede verificar de forma estática antes de ejecutar la app.

## AuthLayout (pantallas de login)

`AuthLayout` es el shell de dos columnas para pantallas de autenticación: panel de marca a la izquierda (oculto en mobile, con logo/tagline/eyebrow/headline/descripción/features/footer por props) y el `children` — la card de login real — a la derecha. Mobile-first: en mobile el panel de marca se colapsa a un header chico (logo + nombre) arriba de la card.

**No implementa autenticación.** Solo da la estructura visual. El botón de Google (`GoogleSignInButton`, con el logo oficial de Google) tampoco hace login por sí solo: recibe `onClick`/`formAction` para que cada proyecto conecte su propio proveedor (NextAuth, Server Action, Firebase, lo que use).

Receta mínima:

```tsx
import { AuthLayout, GoogleSignInButton, Card, CardContent, CardDescription, CardHeader, CardTitle } from "official-uikit-iimp"

export default function LoginPage() {
  return (
    <AuthLayout
      logo={<TuLogoIcon />}
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
          <CardDescription>Inicia sesión con tu cuenta institucional.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Conecta tu propio proveedor de auth aquí */}
          <GoogleSignInButton formAction={miServerActionDeLogin} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
```

Ver el pattern completo, con textos de enlaces legales incluidos, en Storybook: **Patterns → AuthLayout**.

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
- **Tipografía de cuerpo:** `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` (resuelve a San Francisco en Mac/iOS, Segoe UI en Windows). Los títulos siguen en SF Pro Display, mínimo 20px; el texto mínimo del kit es 13px.
- **Todo control interactivo mide mínimo 40px de alto** (Button, Input, Select, Combobox, Toggle, Tabs, Menubar, NavigationMenu, Sidebar, Breadcrumb). Checkbox/Radio/Switch mantienen su caja visual pequeña (así se ven en cualquier sistema), pero exponen un área de clic invisible de 40px o más.
- **Iconos: mínimo 24×24px.** Excepciones documentadas, siempre por una razón física (no cabrían) o semántica (son chrome decorativo junto a texto, no "un icono"): el check dentro de Checkbox/Radio, el icono de un `Badge`, `Kbd`, el caret de disclosure de `NavigationMenuTrigger`/el dropdown de mes-año del `Calendar`, el separador/ellipsis de `Breadcrumb`, la acción de `SidebarMenuAction` (20px) y el glifo `icon-xs` de `Button`/`InputGroupButton` (nace para vivir dentro de un campo o chip ya de 40px).
- `IimpThemeProvider` cambia primary/secondary/radio en runtime.
