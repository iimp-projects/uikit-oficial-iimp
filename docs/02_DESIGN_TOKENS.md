# Design Tokens

## Principio

Los tokens son la capa de contrato entre branding y componentes.

No codificar valores de marca dentro de componentes.

## 1. Brand tokens dinámicos

Provienen de la vertical activa:

```text
primary
primary-foreground
secondary
secondary-foreground
radius
```

La app puede guardar hoy valores HSL/CSS; el provider debe aceptar un formato CSS válido o normalizarlo de forma explícita.

## 2. Product semantic tokens

Definidos por el Design System:

```text
background
foreground

card
card-foreground

popover
popover-foreground

muted
muted-foreground

accent
accent-foreground

destructive
destructive-foreground

success
success-foreground

warning
warning-foreground

info
info-foreground

border
input
ring
```

## 3. State tokens

Considerar:

```text
hover
active
focus
disabled
selected
invalid
```

Preferir derivarlos coherentemente del set semántico antes que crear decenas de colores desconectados.

## 4. Spacing

Escala recomendada basada en múltiplos consistentes:

```text
1 = 4px
2 = 8px
3 = 12px
4 = 16px
5 = 20px
6 = 24px
8 = 32px
10 = 40px
12 = 48px
```

No prohibir Tailwind spacing estándar, pero documentar el subconjunto preferido para composición del UI Kit.

## 5. Radius

El valor runtime puede alimentar un token base.

Crear escala derivada:

```text
radius-sm
radius-md
radius-lg
radius-xl
radius-full
```

Evitar que cada componente invente su radius.

## 6. Typography

Definir como mínimo:

```text
display
heading-1
heading-2
heading-3
title
body
body-sm
label
caption
code
```

Cada rol debe especificar:
- font-size,
- line-height,
- font-weight,
- letter-spacing cuando corresponda.

## 7. Elevation

Mantener una escala pequeña:

```text
none
sm
md
lg
```

No crear shadows arbitrarios por feature.

## 8. Motion tokens

Ver `05_MOTION.md`.

## 9. Foreground de primary/secondary

El provider debe resolver `primary-foreground` y `secondary-foreground` con suficiente contraste o permitir override explícito.

No asumir siempre `#fff`.

## 10. Naming

Preferir semántica:

```text
bg-primary
text-primary-foreground
border-border
text-muted-foreground
```

Evitar nombres ligados a la marca:

```text
bg-perumin-orange
bg-proexplo-green
```

## Decisiones de marca (actualizado)

- `--radius` base = 10px. Escala: `rounded-md` 0.8x, `rounded-lg` 1x (controles: button, input, tabs, etc.), `rounded-xl` 1.4x (cards, dialogs).
- `secondary`: fondo `#f2e8dd`, texto `#c09153` (definido por marca). Ratio ≈ 2.4:1, no cumple WCAG AA 4.5:1 para texto normal. Usar solo con texto grande/bold o acompañado de icono/borde, o pedir a marca un foreground más oscuro (p. ej. `#7a5528`).
