---
name: iimp-ui
description: Use whenever creating, modifying, reviewing or migrating frontend UI that must follow the IIMP Design System and @iimp/ui.
---

# IIMP UI Skill

## Trigger

Usar esta skill para:
- crear UI,
- modificar UI,
- crear forms,
- crear dialogs,
- crear tables,
- crear navigation,
- revisar accesibilidad,
- migrar legacy UI,
- implementar un mock/Stitch/Figma en Eventos IIMP.

## Workflow

### P0.a — Read governance
Leer:
- `AGENTS.md`
- `docs/02_DESIGN_TOKENS.md`
- `docs/03_UX_RULES.md`
- `docs/04_ACCESSIBILITY.md`
- `docs/05_MOTION.md`
- `docs/06_COMPONENT_CATALOG.md`
- `docs/07_PATTERNS.md`

### P0.b — Classify request
Determinar:
- primitive,
- pattern,
- layout,
- domain component.

### P0.c — Reuse first
Prioridad:
1. existing pattern
2. existing primitive
3. compose primitives
4. propose Design System extension

Nunca comenzar creando un componente nuevo sin hacer esta clasificación.

### P1.a — Theme
Usar semantic tokens.

No usar:
- brand hex,
- vertical names,
- custom brand conditionals.

### P1.b — UX
Validar:
- target sizes,
- hierarchy,
- focus,
- states,
- responsive,
- loading/error/empty cuando aplique.

### P1.c — Motion
Usar solo motion tokens.
No `transition-all`.

### P2.a — Implement
Preservar lógica existente si es refactor.

### P2.b — Validate
Ejecutar:
- typecheck,
- lint,
- tests,
- build.

### P2.c — Report
Indicar:
- components reused,
- patterns reused,
- new additions,
- validation result.

## Decision map

```text
"Crear botón"
  → Button primitive

"Editar usuario en modal"
  → FormDialog + FormField + controls

"¿Seguro que desea eliminar?"
  → DestructiveDialog

"Mostrar detalle corto"
  → InfoDialog

"Tabla con filtros/paginación"
  → DataTable pattern

"Input con label/error"
  → FormField + Input

"Pantalla diseñada por Stitch"
  → mapear diseño al sistema; NO copiar valores arbitrarios
```

## Hard stop

Si el requerimiento visual no puede representarse con el Design System:

1. no crear workaround silencioso;
2. explicar el gap;
3. proponer extensión de `@iimp/ui`;
4. implementar extensión primero;
5. usarla después.
