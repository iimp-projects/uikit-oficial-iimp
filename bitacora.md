# Bitácora del proyecto

Registro cronológico de cambios, decisiones y validaciones.

## Regla de uso

- Leer este archivo antes de continuar cualquier tarea.
- Al finalizar cada avance relevante, agregar fecha, hora, cambio y validación.
- No eliminar entradas anteriores. Las reversiones también se registran.

## Entradas

- 2026-10-01 15:26:27 America/Lima — Se incorpora la bitácora como contrato transversal para UI Kit, starter y CLI de adopción; pendiente de validación y publicación.
- 2026-10-01 15:30:05 America/Lima — Validación del script de bitácora del starter
- 2026-10-01 15:32:06 America/Lima — Validaciones completadas: lint, TypeScript, 154 pruebas del UI Kit, pruebas del CLI, consumidor, build, Storybook y contrato del starter pasaron.
- 2026-10-01 15:36:07 America/Lima — Se hizo push de `7914b72` a `main` y npm aceptó las publicaciones `official-uikit-iimp@0.8.7` y `@nrivera-iimp/adopt@0.1.2`; el índice público sigue propagándose.
- 2026-10-01 17:52:50 America/Lima — Se detectó el cambio posterior `4df203a` en `LanguageSwitcher`; se prepara la publicación correctiva `official-uikit-iimp@0.8.8` y la actualización del CLI a `@nrivera-iimp/adopt@0.1.3`.
- 2026-10-01 18:02:08 America/Lima — npm indexó y marcó como `latest` `official-uikit-iimp@0.8.8` y `@nrivera-iimp/adopt@0.1.3`.
- 2026-10-02 America/Lima — Se prepara `official-uikit-iimp@0.8.9`: logo por defecto de `DashboardSidebarBrand` incrustado como data URI (tsup `loader .png=dataurl`, PNG reducido 167 KB→53 KB), nuevo prop `logoClassName`, y X de `Dialog`/`Sheet` con `variant="secondary"` (pareja `secondary-foreground`). Validación: tsc, eslint, 158 pruebas Vitest (incluye `close-button.test.tsx` y logo no relativo), build, consumer (verifica data URI en el bundle) y comprobación en navegador en `/a/b/c/`. `e2e/preset.spec.ts` falla de forma previa (esperaba primary/secondary invertidos y SF Pro Display), sin relación con este cambio.
