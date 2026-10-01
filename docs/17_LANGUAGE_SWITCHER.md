# LanguageSwitcher y Google Translate

## Propósito

`LanguageSwitcher` es el control oficial para elegir el idioma de una aplicación. Recibe códigos ISO/BCP 47 y crea un menú accesible con una opción exclusiva por idioma; no hay que mantener un componente distinto para cada combinación.

Por defecto **solo es un selector visual**. La aplicación recibe el código en `onValueChange` y lo conecta a su solución de internacionalización. Esta es la opción preferida para aplicaciones nuevas.

## Importar y usar

La aplicación debe tener el UI Kit instalado y sus estilos importados una vez en la raíz:

```bash
npm install official-uikit-iimp
```

```tsx
// app/layout.tsx
import "official-uikit-iimp/style.css"
```

Uso mínimo en un header:

```tsx
import {
  DashboardHeader,
  DashboardNotifications,
  LanguageSwitcher,
} from "official-uikit-iimp"

<DashboardHeader
  languageSwitcher={
    <LanguageSwitcher
      languages={["es", "en", "qu"]}
      onValueChange={(locale) => changeLocale(locale)}
    />
  }
  notifications={<DashboardNotifications />}
/>
```

El slot `languageSwitcher` siempre se renderiza a la izquierda de `notifications`. El trigger muestra el icono de traducción y el ISO activo; al elegir una opción, actualiza el trigger, cierra el menú y ejecuta `onValueChange`. Si no hay campana, conserva su posición natural antes de las acciones.

### Etiquetas visibles y accesibles

Con un código string, el menú intenta mostrar el nombre del idioma en español (por ejemplo, `es` → `español`) y conserva el ISO en el extremo derecho. Si el navegador no puede resolverlo, muestra el ISO en mayúsculas. Para personalizar el texto o el nombre que leerá un lector de pantalla, pasa objetos:

```tsx
<LanguageSwitcher
  languages={[
    { code: "es", label: "ES", ariaLabel: "Español" },
    { code: "en", label: "EN", ariaLabel: "English" },
    { code: "qu", label: "QU", ariaLabel: "Quechua" },
  ]}
/>
```

Con cero o un idioma, el componente no renderiza controles innecesarios.

## Bridge de Google Website Translator

Para una web que ya usa Google Website Translator, habilita su bridge directamente en el componente:

```tsx
<LanguageSwitcher
  languages={["es", "en", "qu"]}
  googleTranslate={{ sourceLanguage: "es" }}
/>
```

Con esa prop el componente:

1. inserta el destino oculto `#google_translate_element`;
2. carga `translate.google.com/translate_a/element.js` una sola vez (si aún no existe);
3. lee la cookie existente `googtrans=/es/<idioma>` al abrir;
4. al cambiar de idioma, actualiza la cookie y recarga la página;
5. inyecta una vez un `<style>` que oculta el banner superior de Google (`.goog-te-banner-frame`, el iframe suelto que cuelga de `<body>`, el tooltip de hover y el resaltado amarillo) y deshace el `body { top: ... }` que Google escribe inline. No necesitas CSS propio para esto — ocurre automáticamente cada vez que `googleTranslate` está activo, incluidas recargas repetidas (la etiqueta se identifica por id y nunca se duplica).

### Banner e iframe de Google visibles encima de la página

Si ves un iframe suelto (clase `skiptranslate`, a veces con un nombre ofuscado como `VIpgJd-...`) empujando tu contenido hacia abajo al traducir: eso es el banner nativo de Google Website Translator, no un bug del selector. Desde que el bridge inyecta el `<style>` del punto 5 arriba, se oculta solo. Si lo sigues viendo:

- Confirma que estás en `official-uikit-iimp@0.8.4` o superior (`npm ls official-uikit-iimp`).
- Revisa que no haya otra hoja de estilos de tu app sobrescribiendo con una especificidad/`!important` mayor sobre `.goog-te-banner-frame` o `body { top }`.
- El bridge solo inyecta el `<style>` mientras `googleTranslate` esté activo en algún `LanguageSwitcher` montado; si lo quitaste de un layout pero sigue cargado en otro, revisa ese otro.

El valor por defecto de `reload` es `true`. Para una demo o una integración que manejará la recarga por su cuenta:

```tsx
<LanguageSwitcher
  languages={["es", "en", "qu"]}
  googleTranslate={{ sourceLanguage: "es", reload: false }}
  onValueChange={(locale) => console.info("Idioma elegido:", locale)}
/>
```

`loadScript` también es `true` por defecto. Solo úsalo en `false` si la aplicación ya carga y configura el script de Google por su cuenta:

```tsx
<LanguageSwitcher
  languages={["es", "en"]}
  googleTranslate={{ loadScript: false }}
/>
```

Usa **una sola** instancia con `googleTranslate` por página, porque el widget de Google usa el id global `google_translate_element`.

## Límites, privacidad y migración

Google anunció que Website Translator deja de tener soporte el **1 de octubre de 2026**. El bridge se conserva porque una instalación existente puede seguir funcionando hoy, pero no debe ser la única estrategia de localización a largo plazo. Revisa el anuncio oficial de [Google Search Central](https://developers.google.com/search/blog/2020/05/google-translates-website-translator?hl=en).

Al habilitar `googleTranslate`, la página carga un recurso de `translate.google.com` y Google recibe contenido para traducir. Revísalo con privacidad, consentimiento, CSP y los requisitos del sector antes de usarlo en contenido sensible. Nunca expongas credenciales ni claves de traducción en el cliente.

Para proyectos nuevos, migra progresivamente a traducciones controladas por la aplicación (por ejemplo, rutas por locale y catálogos propios) y usa `onValueChange` para cambiar el locale. Mantén los textos críticos, formularios, nombres propios y contenido legal bajo traducciones revisadas por personas.

## Props

| Prop | Tipo | Obligatoria | Default | Uso |
| --- | --- | --- | --- | --- |
| `languages` | `(string \| { code, label?, ariaLabel? })[]` | Sí | — | Incluye **todos** los idiomas visibles, incluido el idioma fuente/original de la página (ej. `"es"`). Con menos de 2 idiomas el componente no renderiza nada. |
| `value` | `string` | No | — | Hace el selector controlado. Si lo pasas, tú decides el idioma activo y debes actualizarlo tú mismo en `onValueChange`. |
| `defaultValue` | `string` | No | primer código de `languages` | Idioma inicial en modo no controlado. |
| `onValueChange` | `(language: string) => void` | No | — | Recibe el código elegido. Conéctalo a tu router/i18n (`next-intl`, etc.) para que el selector haga algo más que cambiar su propio texto. |
| `googleTranslate` | `boolean \| { sourceLanguage?, loadScript?, reload? }` | No | `undefined` (desactivado) | `true` equivale a `{}` (usa los defaults: `sourceLanguage: "es"`, `loadScript: true`, `reload: true`). Ver sección del bridge. |
| `ariaLabel` | `string` | No | `"Seleccionar idioma"` | Nombre accesible del grupo de opciones. |
| `disabled` | `boolean` | No | `false` | Deshabilita el trigger y todas las opciones. |
| `className` | `string` | No | — | Clases extra para el botón trigger. |

### Por qué "no funciona" casi siempre es una prop faltante

- **El menú no aparece:** `languages` tiene menos de 2 entradas (el componente retorna `null` a propósito). Pasa al menos el idioma fuente + uno más.
- **Seleccionar un idioma no traduce nada:** falta `googleTranslate` (sin él, el componente es solo visual — es el comportamiento esperado para apps nuevas con i18n propio) o falta conectar `onValueChange` a tu proveedor de i18n si no usas el bridge de Google.
- **El bridge de Google no traduce al idioma correcto / vuelve a español:** `sourceLanguage` no coincide con el idioma real de tu página (el `lang` de tu `<html>`). Si tu app está en español, usa `{ sourceLanguage: "es" }`; si no, ajústalo al idioma real del contenido original, no al idioma destino.
- **Dos selectores en la misma página no se comportan igual:** usa `googleTranslate` en **una sola instancia** por página (ver advertencia arriba) — el resto, sin esa prop, solo visual u observando el mismo `value` controlado.

## Validación

Antes de abrir un PR ejecuta:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Para validar todos los artefactos del repositorio:

```bash
npm run check
```
