# GEMINI.md

Para cualquier tarea visual, seguir obligatoriamente `AGENTS.md`.

No interpretar mocks o diseños como autorización para inventar:
- colores,
- tamaños,
- radius,
- sombras,
- botones,
- dialogs,
- formularios,
- motion.

Al implementar una pantalla:
1. mapear cada elemento al componente oficial de `official-uikit-iimp`;
2. usar patterns existentes;
3. usar tokens semánticos;
4. conservar layout responsive;
5. reportar cualquier necesidad no cubierta por el Design System antes de crear un patrón nuevo.

No generar HTML controls paralelos ni estilos de marca hardcodeados.
