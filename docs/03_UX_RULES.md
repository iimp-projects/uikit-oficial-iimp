# UX Rules

## Principio

El UI Kit no debe ser solo visual. Debe imponer ergonomía, jerarquía y comportamiento consistentes.

## Target size

Estándar interno IIMP:

```text
44x44 CSS px recomendado para targets interactivos generales.
48px para CTA touch-first cuando el contexto lo justifique.
```

Nota normativa:
- WCAG 2.2 AA 2.5.8 define un mínimo de 24x24 CSS px con excepciones.
- WCAG 2.2 AAA 2.5.5 utiliza 44x44 CSS px.
- IIMP adopta 44px como estándar de producto para aumentar comodidad táctil.

## Controls

Recomendación inicial:

Los tamaños de los controles son los del preset shadcn `luma` (ver la sección "Base visual" al final). No se sobrescriben en las apps.

No todo elemento visual debe medir 44px; el **target interactivo** sí debe cumplir el estándar elegido.

## Jerarquía de acciones

Una sección lógica debe evitar múltiples CTAs compitiendo.

- primary → acción dominante
- secondary → apoyo con énfasis
- outline → cancelar/volver/neutra
- ghost → contextual
- destructive → irreversible

## Forms

Orden:

```text
Label
Description opcional
Control
Error/Help
```

Reglas:
- label siempre visible cuando el contexto lo requiera;
- placeholder no reemplaza label;
- error debe explicar qué corregir;
- no depender solo de color para error;
- mantener distancia consistente entre campos.

## Dialogs

No usar modal para cualquier cosa.

- operación corta y focal → Dialog
- confirmación crítica → Alert/Confirm pattern
- contenido extenso → considerar Sheet/Drawer/Page
- formulario largo → body scrollable, acciones persistentes si es necesario

Evitar dialogs anidados salvo necesidad justificada.

## Responsive

Diseñar mobile-first en targets y reflow.

- evitar horizontal scroll accidental;
- acciones principales accesibles;
- tablas deben tener estrategia responsive explícita;
- dialogs deben adaptarse al viewport.

## Density

V1 recomendada: una densidad estándar.

Agregar `compact` solo si existe una necesidad real de dashboard denso. No introducir dos sistemas de tamaño desde el inicio sin necesidad.

## Feedback

Toda acción asíncrona importante debe tener estado:
- loading,
- success,
- error,
- disabled cuando corresponda.

No permitir doble submit.

## Empty states

Deben explicar:
1. qué ocurre,
2. por qué está vacío cuando sea útil,
3. siguiente acción cuando exista.

## Destructive actions

- diferenciación semántica clara;
- confirmación proporcional al riesgo;
- texto específico: "Eliminar participante" mejor que "Aceptar";
- no usar confirmación destructiva para operaciones triviales.

## Base visual: preset shadcn `b1aIuQ2XC` (v0.4)

El kit usa los componentes del preset de shadcn (estilo `luma`, base `stone`, radio `large` = 0.875rem, iconos Remix; tipografía Apple: SF Pro Text mínimo 13px y SF Pro Display en títulos, mínimo 20px) **sin modificar tamaños**: alturas, tipografía y espaciado son los de shadcn. Lo único propio de IIMP:

- `primary` `#092042` y `secondary` `#f2e8dd` con texto `#c09153` (contraste bajo, ~2.4:1: úsalo en texto grande o con icono).
- Charts y `sidebar-primary` derivan de esos dos colores.
- Tokens semánticos `success`, `warning` e `info` (variantes de `Badge`).
- `IimpThemeProvider` cambia primary/secondary/radio en runtime.
