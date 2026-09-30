# AGENTS.md — Proyecto IIMP

Estas reglas son obligatorias para cualquier agente o desarrollador que modifique este proyecto.

## Quality gate

- Ejecutar `npm run check` antes de finalizar.
- No se aceptan errores ni warnings.
- No desactivar reglas de TypeScript o ESLint para ocultar problemas.
- No usar `any`, `@ts-ignore` ni non-null assertions como atajo.

## UI

- Buscar primero un pattern en `official-uikit-iimp`.
- Buscar después un primitive en `official-uikit-iimp`.
- Componer con esos componentes; no crear un sistema visual paralelo.
- No usar controles HTML nativos cuando exista equivalente oficial.
- No importar Radix, Base UI o shadcn directamente.
- No hardcodear colores, radius, shadows, spacing o motion de marca.
- `className` se usa principalmente para layout, no para redefinir la identidad de un componente.
- `AuthLayout` resuelve login y `DashboardLayout` resuelve el shell autenticado.

## Seguridad

- Tratar Server Actions y Route Handlers como endpoints públicos.
- Validar todo input externo en runtime.
- Comprobar autenticación y autorización dentro de cada operación protegida.
- No exponer secretos con `NEXT_PUBLIC_`.
- Mantener acceso a datos y secretos en módulos `server-only`.
- No registrar cookies, tokens, headers de autorización ni variables de entorno.

## Migraciones

Una migración visual no modifica APIs, routing, permisos, reglas de negocio, estado, validaciones ni side effects.

## Comunicación

Usar caveman full por defecto salvo que el usuario solicite otro estilo.
