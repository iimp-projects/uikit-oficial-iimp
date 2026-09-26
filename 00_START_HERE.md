# IIMP UI Kit — Start Here

Este paquete de documentación sirve como **blueprint ejecutable** para construir `official-uikit-iimp`, el Design System / UI Kit de la plataforma Eventos IIMP.

## Objetivo

Separar claramente cuatro responsabilidades:

1. **Verticales**: definen identidad de marca en runtime (`primary`, `secondary`, `radius`).
2. **Design System**: define reglas de UX, accesibilidad, motion, tipografía, spacing, estados y jerarquías.
3. **official-uikit-iimp**: implementa componentes reutilizables sobre shadcn/ui + Tailwind CSS.
4. **Aplicaciones consumidoras**: usan exclusivamente `official-uikit-iimp` y no inventan estilos paralelos.

Arquitectura objetivo:

```text
Módulo Verticales (DB)
  primary / secondary / radius
            ↓
      IimpThemeProvider
            ↓
       Design Tokens
            ↓
        shadcn/ui
            ↓
   IIMP Patterns / UI Kit
            ↓
     Apps consumidoras
```

## Orden recomendado

No empieces construyendo botones al azar. Sigue este orden:

### Fase 0 — Discovery
Lee:
- `01_MASTER_BUILD_PROMPT.md`
- `docs/01_ARCHITECTURE.md`
- `docs/02_DESIGN_TOKENS.md`

Entrega antes de programar:
- arquitectura,
- estructura de carpetas,
- token taxonomy,
- API del `IimpThemeProvider`,
- lista de componentes,
- plan de publicación NPM.

### Fase 1 — Foundations
Implementar:
- tokens,
- theme runtime,
- primary/secondary dinámicos,
- foreground automático,
- radius,
- focus ring,
- motion tokens,
- spacing,
- typography.

### Fase 2 — Primitives
Normalizar los componentes shadcn indicados en:
- `docs/06_COMPONENT_CATALOG.md`.

### Fase 3 — Patterns
Crear solamente patrones recurrentes:
- `FormDialog`
- `InfoDialog`
- `ConfirmDialog`
- `DestructiveDialog`
- `FormField`
- `FormSection`
- `DataTable`
- `PageHeader`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `StatCard`
- `StatusBadge`

### Fase 4 — Storybook / Showcase
Construir el catálogo visual y Theme Playground.

### Fase 5 — Guardrails
Aplicar:
- ESLint,
- CI,
- restricciones de imports,
- prohibición de colores hardcodeados,
- verificación de accesibilidad.

### Fase 6 — Migración piloto
Migrar primero un único flujo de Eventos IIMP (recomendado: modal "Editar vertical").

### Fase 7 — Migración progresiva
Migrar por familias:
1. tokens/colors
2. buttons
3. form controls
4. fields
5. dialogs
6. badges
7. tables
8. cards
9. tabs/accordions
10. feedback/states

## Archivo principal para agentes

Todos los agentes deben leer primero:

```text
AGENTS.md
```

Para iniciar la construcción con Codex o Claude, copia el contenido de:

```text
01_MASTER_BUILD_PROMPT.md
```

y entrégaselo como tarea inicial.

## Skill incluida

Se incluye:

```text
skills/iimp-ui/SKILL.md
```

Es una skill portable para orientar a un agente durante creación, revisión o migración de UI.

## Regla principal

> Las apps consumidoras no diseñan. Componen.

Si una pantalla necesita un patrón visual que `official-uikit-iimp` no tiene, se extiende primero el Design System y recién después se usa en la feature.
