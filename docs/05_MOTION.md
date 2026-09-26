# Motion

## Principio

Motion comunica estado, jerarquía y continuidad. No debe ser decoración arbitraria.

## Tokens

Base propuesta:

```text
motion-fast   = 120ms
motion-normal = 180ms
motion-slow   = 250ms
```

Easing estándar:

```text
cubic-bezier(0.2, 0, 0, 1)
```

Ajustar únicamente si pruebas del sistema justifican otro valor.

## Guía

| Interacción | Duración orientativa |
|---|---:|
| Hover/focus state | 120–180ms |
| Button press | 100–150ms |
| Dropdown/Popover | 150–200ms |
| Dialog open/close | 180–250ms |
| Accordion expand | 200–250ms |
| Toast | 200–300ms |

## Regla

Evitar:

```css
transition: all ...
```

Animar únicamente propiedades relevantes.

## Button

Debe transmitir respuesta inmediata:
- hover,
- focus,
- pressed/active,
- disabled,
- loading.

Un `scale(0.98)` muy sutil puede usarse como press feedback si encaja con el sistema, pero no es obligatorio si existe otro press state claro.

## Dialog

Entrada:
- fade overlay,
- fade + scale/translate sutil del content.

Salida:
- simétrica y corta.

No usar animaciones largas que retrasen tareas repetitivas.

## Accordion / Collapsible

Animar expansión de forma estable evitando saltos de layout perceptibles.

## Loading

No convertir toda interacción breve en un spinner.

Para operaciones asíncronas:
- conservar ancho de botón,
- evitar layout shift,
- bloquear doble submit cuando corresponda.

## Reduced motion

Debe existir variante reducida mediante `prefers-reduced-motion`.

El contenido debe permanecer usable sin motion.

## Anti-patterns

- bounce innecesario,
- animaciones > 400ms para controles rutinarios,
- transformaciones decorativas constantes,
- scroll hijacking,
- paralaje en administración,
- motion diferente por feature.
