# Guardrails

Los `.md` orientan. Los guardrails hacen cumplir.

## 1. Restricted native controls

En apps consumidoras, ESLint debe advertir o fallar cuando se use directamente:

```text
button
input
select
textarea
```

salvo archivos/carpetas autorizadas.

Mensaje sugerido:

```text
Use the equivalent component from official-uikit-iimp.
```

## 2. Restricted imports

Bloquear imports directos de:
- Radix/Base UI/React Aria primitives elegidos internamente,
- componentes copiados localmente que compitan con `official-uikit-iimp`.

La aplicación consumidora debe importar desde `official-uikit-iimp`.

## 3. Hardcoded brand colors

Crear regla/script para detectar en features:

```text
#RGB
#RRGGBB
rgb(
rgba(
hsl(
hsla(
oklch(
```

Permitir únicamente:
- theme adapters,
- archivos de tokens,
- tests/fixtures justificadas.

## 4. Tailwind arbitrary values

Revisar:

```text
h-[...]
rounded-[...]
shadow-[...]
text-[...]
bg-[...]
```

No todo arbitrary value es incorrecto, pero debe justificar layout real y no duplicar tokens del sistema.

## 5. className override policy

Apps:
- sí: layout (`w-full`, grid/flex, responsive positioning)
- no: redefinir visual del primitive

Considerar una regla de revisión automática para detectar overrides frecuentes.

## 6. Jerarquía semántica de Button

Antes de generar, revisar o migrar una interfaz:

- identificar el contexto visual y su acción dominante;
- evitar más de un `Button` Primary (`variant="default"` o variante omitida) compitiendo en ese contexto;
- no asumir que el segundo botón debe ser `secondary`;
- reservar `destructive` para una consecuencia destructiva o irreversible;
- señalar el incumplimiento antes de modificar una vista existente.

Esta regla depende del significado y del límite del contexto visual. `iimpGuardrails` no debe intentar imponerla con selectores JSX frágiles que produzcan falsos positivos; se valida mediante instrucciones de agentes, revisión de UI, Storybook y checklist de PR.

## 7. Layouts oficiales

Las apps deben usar:

- `AuthLayout` para login;
- `DashboardLayout` + `DashboardHeader` para el shell autenticado.

`iimpGuardrails` falla si `AuthLayout`, `DashboardLayout`, `DashboardHeader`, `DashboardSidebarBrand`, `DashboardSidebarUser` o `DashboardNotifications` se importan desde una ruta local o cualquier paquete distinto de `official-uikit-iimp`. Esto evita copias con el mismo contrato. Un shell manual con otro nombre no puede detectarse de forma confiable sin falsos positivos; `AGENTS.md`, revisión de UI y checklist de PR cubren ese caso.

Los cambios de color usan `brandTone` y `sidebarTone`, que consumen tokens semánticos. No justifican una copia local.

## 8. CI

Pipeline mínimo:

```text
install
typecheck
lint
unit tests
build package
build storybook
accessibility tests
```

## 9. Pull request checklist

Todo PR de UI debe confirmar:
- componente existente reutilizado;
- `AuthLayout`/`DashboardLayout` reutilizado cuando corresponde;
- jerarquía de acciones revisada por contexto visual;
- no hardcoded brand color;
- keyboard/focus;
- responsive;
- loading/error/empty si aplica;
- Storybook actualizado si cambia el UI Kit;
- no business logic dentro del package.

## 10. Consumer contract test

Crear una pequeña app fixture que instale el paquete publicado/empacado y verifique:
- imports,
- CSS,
- theme runtime,
- tree shaking básico,
- React peer dependency correcta.
