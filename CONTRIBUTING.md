# Contribuir a official-uikit-iimp

Antes de modificar cualquier UI lee `AGENTS.md` y los documentos de `docs/` (fuente de verdad).

## Desarrollo

```bash
npm install
npm run storybook   # catálogo en http://localhost:6006
```

Cada primitive/pattern vive junto a su archivo como `*.stories.tsx`.

## Verificación

```bash
npm run typecheck
npm run lint
npm run test           # unit + smoke/a11y de todas las stories
npm run test:e2e       # Playwright: tamaños táctiles 44px, radius, tipografía, tokens
npm run build
npm run test:consumer  # empaca el paquete y lo prueba en una app limpia
```

## Publicar

```bash
npm version <patch|minor|major>
npm run build && npm run test:consumer
npm publish
```

`npm publish` pide autorización en el navegador (y OTP si tu cuenta usa 2FA).
