# CLAUDE.md

Antes de modificar cualquier interfaz:

1. Lee `AGENTS.md`.
2. Lee los documentos enlazados como fuente de verdad.
3. Inspecciona exports existentes de `@iimp/ui`.
4. Busca un Pattern antes de crear una composición nueva.
5. Busca un Primitive antes de crear un control.
6. No implementes una segunda versión visual dentro de una feature.

Para refactors UI:

- preservar lógica de negocio;
- evitar cambios simultáneos masivos;
- migrar por familia de componentes;
- ejecutar typecheck/lint/tests/build al finalizar cada fase.

`@iimp/ui` es la autoridad visual del producto.
