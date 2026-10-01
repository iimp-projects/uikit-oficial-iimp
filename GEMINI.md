# GEMINI.md

Para cualquier tarea visual, seguir obligatoriamente `AGENTS.md`.

Antes de continuar una tarea, leer `bitacora.md`. Al completar cada avance relevante, registrar fecha/hora, cambio y validación; nunca borrar el historial.

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
6. asignar variantes de `Button` por jerarquía semántica según `AGENTS.md`: no por color ni por posición; señalar incumplimientos existentes antes de cambiarlos.
7. usar `AuthLayout` para login y la familia `DashboardLayout`/`DashboardHeader`/`DashboardSidebarBrand`/`DashboardSidebarUser`/`DashboardNotifications` para el shell autenticado; cambiar sus superficies con props semánticas, no con copias locales.

No generar HTML controls paralelos ni estilos de marca hardcodeados.
