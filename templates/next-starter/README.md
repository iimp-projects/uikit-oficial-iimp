# IIMP Next Starter

Boilerplate oficial para proyectos nuevos de Eventos IIMP. Crea una aplicación Next.js con App Router, React, TypeScript estricto, Tailwind CSS v4, `official-uikit-iimp`, pruebas, CI y skills de agentes.

Este es el segundo de los tres artefactos del estándar IIMP. Para el mapa completo consulta el [README del UI Kit](https://github.com/iimp-projects/uikit-oficial-iimp#empieza-aquí--elige-solo-una-ruta) y la [guía de bootstrap y adopción](https://github.com/iimp-projects/uikit-oficial-iimp/blob/main/docs/16_PROJECT_BOOTSTRAP.md).

Requiere Node.js 22.22.2 o superior.

## Crear un proyecto

```bash
npx create-next-app@latest \
  --example "https://github.com/iimp-projects/uikit-oficial-iimp" \
  --example-path templates/next-starter \
  mi-proyecto

cd mi-proyecto
npm run setup
npm run check
npm run dev
```

`npm run setup` instala las skills base que todavía no existan y luego presenta recomendaciones adicionales derivadas del stack detectado. No reemplaza skills existentes.

## Qué incluye

- Next.js 16 con App Router.
- React 19.
- TypeScript `strict` y reglas adicionales de seguridad de tipos.
- ESLint Core Web Vitals, TypeScript type-aware y guardrails del UI Kit.
- Política de cero warnings mediante `eslint . --max-warnings=0`.
- Tailwind CSS v4 conectado a los tokens del UI Kit.
- Vitest y Testing Library.
- Playwright disponible para pruebas end-to-end.
- Validación runtime con Zod.
- Headers HTTP defensivos básicos.
- GitHub Actions ejecutando el quality gate.
- `AGENTS.md`, `CLAUDE.md` y `GEMINI.md` con la misma gobernanza IIMP.
- `bitacora.md` y el comando `npm run bitacora` para conservar el contexto entre avances y agentes.

## Flujo diario

```bash
npm run dev          # desarrollo
npm run test:watch   # pruebas durante el trabajo
npm run check        # obligatorio antes de abrir o aprobar un PR
```

`npm run check` ejecuta formato, TypeScript, ESLint, pruebas y el build de producción. El PR no debe fusionarse si alguna etapa falla.

## Bitácora compartida

Antes de modificar el proyecto, Codex, Claude y Gemini deben leer `bitacora.md`. Al completar cada avance relevante, registran fecha/hora America/Lima, el cambio y la validación; no se elimina el historial.

```bash
npm run bitacora -- "Se terminó la vista de proveedores y npm run check pasó."
```

`AGENTS.md` es la regla compartida y `CLAUDE.md`/`GEMINI.md` son los puntos de entrada para esos agentes.

## UI

Los componentes se importan exclusivamente desde el paquete oficial:

```tsx
import { Button, FormField, Input } from "official-uikit-iimp"
```

No copies primitives shadcn dentro de la aplicación. Si falta un componente o pattern, propón primero una extensión de `official-uikit-iimp`.

Tailwind se utiliza principalmente para layout. La identidad visual proviene de tokens semánticos y de los componentes oficiales.

## Personalización del dashboard y login

`AuthLayout` y `DashboardLayout` son shells visuales. La aplicación pasa su contenido, acciones, navegación y autenticación mediante props/children; actualizar el paquete no sobrescribe ese código.

El header puede mostrar la versión pública de la aplicación con `DashboardVersion`:

```tsx
import { DashboardHeader, DashboardVersion } from "official-uikit-iimp"
import { appVersion } from "@/lib/project"

;<DashboardHeader
  navigation={<AppBreadcrumb />}
  status={<DashboardVersion version={appVersion} />}
/>
```

## Skills

`npm run setup` delega la instalación idempotente de skills a `@nrivera-iimp/adopt`, publicado en npm. El comando se puede ejecutar directamente en cada proyecto creado desde este starter.

```bash
npm run setup
```

Instala las skills institucionales faltantes para los agentes compatibles, incluidos Codex, Claude y Gemini. Antes revisa `.agents/skills`, `.codex/skills`, `.claude/skills` y `.gemini/skills`, por lo que no reemplaza una skill existente. Al final, `find-skills` analiza las tecnologías detectadas y muestra una lista única para instalar todas, algunas o ninguna.

Para volver a buscar recomendaciones:

```bash
npm run skills:recommend
```

## Actualizaciones

No cambies todas las dependencias a `latest` directamente en una rama funcional. Las actualizaciones de Next.js, React y el UI Kit deben entrar mediante PR, ejecutar `npm run check` y revisar los cambios de migración.

## Variables de entorno

Copia `.env.example` a `.env.local`. Solo variables deliberadamente públicas pueden usar el prefijo `NEXT_PUBLIC_`. Valida datos externos en runtime y mantén secretos dentro de módulos server-only.

`NEXT_PUBLIC_APP_VERSION` es la versión que se muestra en el dashboard. Si no existe `.env.local`, el starter usa automáticamente la versión de `package.json`; en ambos casos inicia en `v0.0.1` y se mantiene sincronizada con `.env.example`:

```bash
npm run version:check      # falla si package.json y .env.example difieren
npm run release:patch      # 0.0.1 → 0.0.2
npm run release:minor      # 0.0.1 → 0.1.0
npm run release:major      # 0.0.1 → 1.0.0
```

No se incrementa la versión en cada guardado o commit: eso genera versiones inútiles. El incremento ocurre al preparar una entrega y `npm version` actualiza el número, genera el tag Git y ejecuta el script que sincroniza `NEXT_PUBLIC_APP_VERSION`. El quality gate no permite un desajuste.
