# IIMP Next Starter

Boilerplate oficial para proyectos nuevos de Eventos IIMP. Crea una aplicación Next.js con App Router, React, TypeScript estricto, Tailwind CSS v4, `official-uikit-iimp`, pruebas, CI y skills de agentes.

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
- `AGENTS.md` con gobernanza IIMP.

## Flujo diario

```bash
npm run dev          # desarrollo
npm run test:watch   # pruebas durante el trabajo
npm run check        # obligatorio antes de abrir o aprobar un PR
```

`npm run check` ejecuta formato, TypeScript, ESLint, pruebas y el build de producción. El PR no debe fusionarse si alguna etapa falla.

## UI

Los componentes se importan exclusivamente desde el paquete oficial:

```tsx
import { Button, FormField, Input } from "official-uikit-iimp"
```

No copies primitives shadcn dentro de la aplicación. Si falta un componente o pattern, propón primero una extensión de `official-uikit-iimp`.

Tailwind se utiliza principalmente para layout. La identidad visual proviene de tokens semánticos y de los componentes oficiales.

## Personalización del dashboard y login

`AuthLayout` y `DashboardLayout` son shells visuales. La aplicación pasa su contenido, acciones, navegación y autenticación mediante props/children; actualizar el paquete no sobrescribe ese código.

## Skills

```bash
npm run setup
```

Instala las skills institucionales faltantes. Al final, `find-skills` analiza las tecnologías detectadas y muestra una lista única para instalar todas, algunas o ninguna.

Para volver a buscar recomendaciones:

```bash
npm run skills:recommend
```

## Actualizaciones

No cambies todas las dependencias a `latest` directamente en una rama funcional. Las actualizaciones de Next.js, React y el UI Kit deben entrar mediante PR, ejecutar `npm run check` y revisar los cambios de migración.

## Variables de entorno

Copia `.env.example` a `.env.local`. Solo variables deliberadamente públicas pueden usar el prefijo `NEXT_PUBLIC_`. Valida datos externos en runtime y mantén secretos dentro de módulos server-only.
