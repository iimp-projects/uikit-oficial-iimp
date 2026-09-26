# Accessibility

Objetivo: diseñar `@iimp/ui` para que accesibilidad sea el comportamiento por defecto.

## Referencia base

Adoptar WCAG 2.2 como marco.

## Pointer targets

Estándar IIMP:
- 44x44 CSS px como target recomendado del producto.

Contexto WCAG:
- 2.5.8 Target Size (Minimum), Level AA: 24x24 CSS px, con excepciones.
- 2.5.5 Target Size (Enhanced), Level AAA: 44x44 CSS px, con excepciones.

## Keyboard

Todo componente interactivo debe:
- ser alcanzable cuando corresponda;
- tener orden lógico;
- funcionar con teclado;
- no generar traps de foco salvo componentes modales gestionados correctamente.

## Focus

El focus visible debe:
- distinguirse claramente;
- no depender del hover;
- tener contraste suficiente;
- respetar `:focus-visible`.

No eliminar outlines sin reemplazo adecuado.

## Labels

Inputs deben tener nombre accesible.

Icon buttons requieren label accesible aunque visualmente solo tengan icono.

## Color

No comunicar:
- error,
- success,
- selected,
- required,
- disabled

solo mediante color.

Agregar texto, iconografía o estructura cuando corresponda.

## Contrast

El ThemeProvider debe controlar foreground de primary/secondary.

No asumir blanco sobre cualquier brand color.

Crear pruebas de contraste para combinaciones dinámicas.

## Dialogs

Deben gestionar:
- focus inicial razonable;
- focus trap;
- Escape cuando corresponda;
- retorno del foco al trigger;
- title accesible;
- description cuando sea necesaria.

Preferir primitives con comportamiento accesible ya resuelto.

## Reduced motion

Obligatorio soportar:

```css
@media (prefers-reduced-motion: reduce) { ... }
```

No eliminar información funcional al reducir animación.

## Error handling

Los errores de formularios deben:
- estar asociados al control;
- ser legibles;
- indicar qué corregir;
- actualizar atributos ARIA correspondientes cuando aplique.

## Testing

Mínimo:
- keyboard manual,
- focus visible,
- screen reader smoke test en patterns críticos,
- axe/Storybook accessibility addon o equivalente,
- contraste para themes dinámicos.
