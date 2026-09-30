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
4. al cambiar de idioma, actualiza la cookie y recarga la página.

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

| Prop | Uso |
| --- | --- |
| `languages` | Obligatoria. `string[]` u objetos `{ code, label?, ariaLabel? }`. |
| `value` / `defaultValue` | Selector controlado o no controlado. |
| `onValueChange` | Recibe el código seleccionado. |
| `googleTranslate` | `true` o `{ sourceLanguage?, loadScript?, reload? }` para el bridge legado. |
| `ariaLabel` | Nombre accesible del grupo; por defecto `Seleccionar idioma`. |
| `disabled` | Deshabilita todos los idiomas. |

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
