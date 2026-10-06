# AGENTS.md — Proyecto IIMP

Estas reglas son obligatorias para cualquier agente o desarrollador que modifique este proyecto.

Catálogo de componentes, guías y reglas con ejemplos (Storybook): https://uikit-oficial-iimp.vercel.app/

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

## Bitácora obligatoria

- Leer `bitacora.md` antes de iniciar o continuar una tarea.
- Por cada avance relevante, agregar fecha/hora America/Lima, cambio y validación ejecutada.
- Usar `npm run bitacora -- "descripción del avance"` para registrar entradas manuales.
- No borrar ni reescribir entradas anteriores; las reversiones se anotan como una entrada nueva.
- Codex, Claude y Gemini comparten esta regla mediante `AGENTS.md`, `CLAUDE.md` y `GEMINI.md`.

## Comunicación

Usar caveman full por defecto salvo que el usuario solicite otro estilo.
