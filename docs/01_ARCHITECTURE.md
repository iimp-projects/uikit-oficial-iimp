# Architecture

## Package

Nombre recomendado:

```text
@iimp/ui
```

## Responsabilidades

### `@iimp/ui`
Contiene:
- tokens,
- theme runtime,
- primitives,
- patterns,
- styles,
- helpers estrictamente visuales,
- Storybook,
- tests.

No contiene:
- APIs de Eventos IIMP,
- fetching,
- lógica de permisos,
- reglas de eventos,
- lógica de verticales,
- persistencia.

### App consumidora
Contiene:
- módulo Verticales,
- lógica de negocio,
- datos,
- features,
- páginas.

Entrega al UI Kit:

```ts
{
  primary,
  secondary,
  radius
}
```

## Estructura sugerida

```text
iimp-ui/
├── packages/
│   └── ui/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   └── patterns/
│       │   ├── theme/
│       │   ├── tokens/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── styles/
│       │   └── index.ts
│       └── package.json
├── apps/
│   └── storybook/
├── docs/
├── skills/
└── AGENTS.md
```

## Dependency direction

```text
tokens
  ↓
theme
  ↓
primitives
  ↓
patterns
  ↓
consumer app
```

Nunca invertir estas dependencias.

## Wrapper policy

No crear `IimpButton`, `IimpInput`, etc. solo por renombrar.

Regla:
- aspecto → primitive
- composición repetida → pattern
- lógica de negocio → app consumidora

## Public API

Exportar de manera explícita desde el package.

Evitar que consumidores importen rutas internas:

```tsx
// correcto
import { Button } from "@iimp/ui"

// evitar
import { Button } from "@iimp/ui/src/components/ui/button"
```

## Versionado

Usar SemVer.

- PATCH: fix visual sin ruptura API
- MINOR: componente/variant nueva compatible
- MAJOR: cambio breaking de props/tokens/comportamiento

## Peer dependencies

React/ReactDOM deben tratarse como peer dependencies para evitar duplicados.
