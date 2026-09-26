# Theming

## Principio

shadcn recomienda CSS variables y tokens semánticos. El UI Kit debe aprovechar ese modelo para recibir branding dinámico.

## API propuesta

```ts
type IimpTheme = {
  primary: string
  secondary: string
  radius?: string
  primaryForeground?: string
  secondaryForeground?: string
}
```

```tsx
<IimpThemeProvider theme={theme}>
  {children}
</IimpThemeProvider>
```

## Comportamiento

El provider:
1. valida/normaliza valores;
2. aplica CSS variables en un scope definido;
3. resuelve foregrounds si no fueron enviados;
4. aplica radius base;
5. no conoce el nombre de la vertical.

## Tokens esperados

```text
--primary
--primary-foreground
--secondary
--secondary-foreground
--radius
```

El resto pertenece al Design System.

## Scope

Preferir que el provider pueda tematizar:
- todo el documento,
- o un subtree específico si una app lo necesita.

Evitar efectos globales inesperados cuando se renderizan previews de múltiples themes.

## Vertical module

El módulo existente de Eventos IIMP continúa guardando:

```text
primaryColor
secondaryColor
radius
```

No mover lista de verticales al paquete.

El UI Kit debe seguir funcionando con una vertical creada mañana sin publicar nueva versión.

## Foreground

No asumir:

```text
primary-foreground = white
```

Resolver contraste o aceptar override.

## Radius

Si `radius` sigue siendo editable por vertical:
- validar límites;
- derivar escala;
- impedir valores extremos que rompan legibilidad/targets.

Alternativa futura:
- convertir radius en decisión de producto fija si no existe una razón de marca real.

## Dark mode

Si se implementa:
- no calcularlo simplemente invirtiendo colores;
- mantener semantic tokens específicos;
- validar contraste de brand colors.

## Tailwind

Las apps consumidoras deben utilizar tokens semánticos cuando necesiten color:

```tsx
bg-background
text-foreground
border-border
bg-primary
text-primary-foreground
```

No utilizar color de vertical directamente.
