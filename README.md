# official-uikit-iimp

Design System / UI Kit oficial de Eventos IIMP. Ver `AGENTS.md` y `docs/` como fuente de verdad antes de modificar componentes.

## Desarrollo (preview visual)

```bash
npm run storybook
```

Abre Storybook en `http://localhost:6006`. Cada primitive/pattern vive junto a su archivo como `*.stories.tsx` (ej. `src/components/ui/button.stories.tsx`).

## Build del paquete npm

```bash
npm run build
```

Genera `dist/` (ESM, CJS, tipos y `dist/style.css`). Solo `dist/` se publica (ver `files` en `package.json`).

## Publicar

```bash
npm version <patch|minor|major>
npm publish --access public
```

## Consumo en otro proyecto

```bash
npm install official-uikit-iimp
```

```tsx
import { Button } from "official-uikit-iimp"
import "official-uikit-iimp/style.css"
```

### Theming por vertical (runtime)

```tsx
import { IimpThemeProvider } from "official-uikit-iimp"

<IimpThemeProvider theme={{ primary: vertical.primaryColor, secondary: vertical.secondaryColor, radius: vertical.radius }}>
  <App />
</IimpThemeProvider>
```

Si no envías `primaryForeground`/`secondaryForeground`, se resuelven automáticamente por contraste (nunca asume blanco).

### Guardrails de ESLint (recomendado en la app consumidora)

```js
// eslint.config.js de la app consumidora
import { iimpGuardrails } from "official-uikit-iimp/eslint"

export default [
  // ...tu config existente
  ...iimpGuardrails,
]
```

Bloquea `<button>/<input>/<select>/<textarea>` nativos e imports directos de Radix/Base UI o rutas internas del paquete.

## Catálogo público en GitHub Pages

Cada push a `main` publica Storybook estático vía `.github/workflows/deploy-storybook.yml`. Habilitar una vez en el repo: Settings → Pages → Source: GitHub Actions.

## Calidad

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run build-storybook
```
