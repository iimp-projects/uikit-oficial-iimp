# Prompt — UI Audit del proyecto existente

Analiza todo el frontend de Eventos IIMP.

NO modifiques archivos.

Genera `UI_AUDIT.md`.

## Busca

- controles nativos `<button>`, `<input>`, `<select>`, `<textarea>`;
- componentes visuales que no provengan del UI Kit;
- imports directos de Radix/Base UI/otras libraries;
- dialogs/modals custom;
- colores hardcodeados;
- `style={{...}}` visual;
- arbitrary Tailwind values;
- tamaños de buttons/inputs inconsistentes;
- labels inconsistentes;
- iconos decorativos en forms;
- spacing inconsistente;
- typography inconsistente;
- border radius inconsistente;
- shadows arbitrarios;
- tables duplicadas;
- cards duplicadas;
- feedback states inconsistentes;
- loading/error/empty states no normalizados;
- componentes funcionalmente equivalentes duplicados.

## Formato

Por hallazgo:

```text
Severity:
File:
Component:
Category:
Current implementation:
Problem:
Recommended @iimp/ui replacement:
Risk:
Migration notes:
```

## Resumen

Al inicio incluir métricas:

```text
Total dialogs:
Dialog patterns:
Native inputs:
Native buttons:
Hardcoded colors:
Duplicate components:
Potential pattern candidates:
```

## Regla

No proponer reescribir lógica de negocio.

Este audit es exclusivamente visual/arquitectónico.
