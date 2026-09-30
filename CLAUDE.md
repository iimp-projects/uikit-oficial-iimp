# CLAUDE.md

Antes de modificar cualquier interfaz:

1. Lee `AGENTS.md`.
2. Lee los documentos enlazados como fuente de verdad.
3. Inspecciona exports existentes de `official-uikit-iimp`.
4. Busca un Pattern antes de crear una composición nueva.
5. Busca un Primitive antes de crear un control.
6. No implementes una segunda versión visual dentro de una feature.
7. Antes de elegir variantes de `Button`, aplica la jerarquía obligatoria de `AGENTS.md` y `docs/03_UX_RULES.md`: una acción Primary dominante por contexto, `secondary` solo para una alternativa realmente importante y `destructive` solo por intención de riesgo.
8. Si una vista existente incumple esa jerarquía, señala el problema antes de modificarla.
9. Para login usar `AuthLayout`; para shell autenticado usar `DashboardLayout`, `DashboardHeader`, `DashboardSidebarBrand`, `DashboardSidebarUser` y `DashboardNotifications`. Cambiar color mediante `brandTone`/`sidebarTone`, no mediante copias locales.

Para refactors UI:

- preservar lógica de negocio;
- evitar cambios simultáneos masivos;
- migrar por familia de componentes;
- ejecutar typecheck/lint/tests/build al finalizar cada fase.

`official-uikit-iimp` es la autoridad visual del producto.
