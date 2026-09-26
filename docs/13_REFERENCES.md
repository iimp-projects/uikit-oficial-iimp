# References

Estas fuentes deben revisarse al iniciar la implementación porque pueden evolucionar.

## shadcn/ui

### Theming
https://ui.shadcn.com/docs/theming

Puntos clave:
- recomienda CSS variables;
- usa tokens semánticos `primary`, `foreground`, etc.;
- soporta radius base y escala derivada.

### Components
https://ui.shadcn.com/docs/components

Usar como fuente actual para validar el catálogo de componentes.

### Registry
https://ui.shadcn.com/docs/registry

Un registry privado/interno puede ser útil como complemento, aunque para Eventos IIMP se recomienda que el producto consuma el package `@iimp/ui` para tener versionado central.

## WCAG 2.2

### Target Size (Minimum) — 2.5.8, Level AA
https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum

Referencia:
- 24x24 CSS px como criterio mínimo con excepciones.

### Target Size (Enhanced) — 2.5.5, Level AAA
https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced

Referencia:
- 44x44 CSS px con excepciones.

### Technique C44
https://www.w3.org/WAI/WCAG22/Techniques/css/C44

Ejemplo práctico de targets 44x44.

## Apple Human Interface Guidelines

Buttons:
https://developer.apple.com/design/human-interface-guidelines/buttons

Referencia útil de ergonomía:
- hit region general de 44x44 pt.

## Nota de gobernanza

IIMP adopta 44px como estándar de producto, aunque WCAG AA permita targets menores en ciertas condiciones. Es una decisión de ergonomía, no una afirmación de que 44px sea el mínimo AA universal.
