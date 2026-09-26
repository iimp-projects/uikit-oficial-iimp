# Migration Plan — Eventos IIMP

## Paso 1 — Inventario

Generar `UI_AUDIT.md` sin modificar código.

Buscar:
- native controls,
- buttons custom,
- dialogs custom,
- duplicate components,
- hardcoded colors,
- inline styles,
- arbitrary Tailwind,
- imports de primitives externos,
- inconsistent typography,
- inconsistent spacing,
- inconsistent modal sizing.

## Paso 2 — Clasificar

Cada hallazgo:
- Critical
- High
- Medium
- Low

Incluir:
- archivo,
- componente,
- problema,
- reemplazo propuesto.

## Paso 3 — Piloto

Migrar exclusivamente "Editar vertical".

No modificar:
- API,
- hooks,
- state,
- upload,
- validation,
- business rules.

Objetivo:
- validar ThemeProvider usando primary/secondary/radius reales;
- validar FormDialog/FormField;
- validar buttons;
- validar scroll/footer.

## Paso 4 — Congelar patrón

Cuando el piloto esté aprobado, usarlo como referencia de migración.

## Paso 5 — Migrar por familia

Orden:

1. theme/colors
2. buttons
3. inputs/textareas
4. selects/checkbox/radio/switch
5. FormField
6. dialogs
7. badges
8. cards
9. tables
10. tabs/accordion
11. dropdown/popover/tooltips
12. feedback
13. loading/empty/error
14. navigation/sidebar

## Paso 6 — No mezclar refactor funcional

Cada PR debe ser pequeño.

Una migración UI no cambia comportamiento salvo bug explícitamente acordado.

## Paso 7 — Guardrails

Solo cuando gran parte de una familia haya migrado, activar enforcement que pueda romper legacy.

Ejemplo:
- primero migrar botones,
- después prohibir `<button>` directo.

## Paso 8 — Cleanup

Eliminar:
- componentes legacy sin uso,
- CSS muerto,
- tokens duplicados,
- paquete viejo si ya no aporta valor.
