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

## 6. CI

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

## 7. Pull request checklist

Todo PR de UI debe confirmar:
- componente existente reutilizado;
- no hardcoded brand color;
- keyboard/focus;
- responsive;
- loading/error/empty si aplica;
- Storybook actualizado si cambia el UI Kit;
- no business logic dentro del package.

## 8. Consumer contract test

Crear una pequeña app fixture que instale el paquete publicado/empacado y verifique:
- imports,
- CSS,
- theme runtime,
- tree shaking básico,
- React peer dependency correcta.
