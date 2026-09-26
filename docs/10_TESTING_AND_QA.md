# Testing & QA

## Pirámide

### Type / lint
- TypeScript strict
- ESLint
- build validation

### Unit
Priorizar:
- theme provider,
- color/foreground resolver,
- variant logic,
- helpers.

### Component
Probar:
- keyboard behavior,
- state props,
- disabled/loading,
- event forwarding,
- accessibility names.

### Storybook
Cada primitive/pattern debe tener stories representativas.

## Visual regression

Recomendado para:
- Button,
- Inputs,
- Dialogs,
- Forms,
- Table,
- Sidebar,
- mobile variants.

## Accessibility

Usar tooling automatizado compatible con Storybook/axe como primera capa, más smoke tests manuales.

Automatizado no reemplaza:
- keyboard review,
- focus review,
- screen reader smoke test.

## Theme matrix

Probar como mínimo:

```text
Theme A: light primary + dark secondary
Theme B: dark primary + light secondary
Theme C: saturated colors
Theme D: low-chroma corporate colors
```

Validar:
- foreground,
- focus ring,
- disabled,
- destructive,
- hover.

## Viewports

Mínimo sugerido:
- mobile pequeño,
- mobile,
- tablet,
- desktop,
- desktop ancho.

## Dialog QA

Validar:
- open/close,
- Esc,
- overlay click según policy,
- focus trap,
- focus return,
- scroll largo,
- mobile,
- sticky footer cuando aplique.

## Form QA

Validar:
- label association,
- required,
- invalid,
- help text,
- disabled,
- readonly,
- keyboard,
- autofill cuando corresponda.

## Exit criteria

Ninguna fase se considera terminada si:
- typecheck falla,
- lint falla,
- build falla,
- Storybook build falla,
- existe error de accesibilidad crítico conocido.
