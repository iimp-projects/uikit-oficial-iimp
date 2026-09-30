"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

type LanguageSwitcherOption = {
  /** BCP 47 / ISO code passed back to the app, for example `es`, `en` or `qu`. */
  code: string
  /** Visible label. Defaults to the uppercase code. */
  label?: React.ReactNode
  /** Accessible name when the visible label is not self-explanatory. */
  ariaLabel?: string
}

type GoogleTranslateConfig = {
  /** Original language configured in the Google Website Translator. Defaults to Spanish. */
  sourceLanguage?: string
  /** Loads Google's Website Translator script when it is not already present. Defaults to true. */
  loadScript?: boolean
  /** Reload after writing Google Translate's `googtrans` cookie. Defaults to true. */
  reload?: boolean
}

type LanguageSwitcherProps = {
  /** Available locales. Each entry creates one official ToggleGroup control. */
  languages: readonly (string | LanguageSwitcherOption)[]
  /** Controlled selected locale. */
  value?: string
  /** Initial selected locale when the component is uncontrolled. */
  defaultValue?: string
  /** Called after a person selects a locale. Connect this to the application's i18n provider. */
  onValueChange?: (language: string) => void
  /**
   * Enables the legacy Google Website Translator cookie bridge. The page must load Google's
   * translator script separately; this component only provides its required target element and
   * updates the selected-language cookie.
   */
  googleTranslate?: boolean | GoogleTranslateConfig
  /** Accessible name for the locale selection group. */
  ariaLabel?: string
  className?: string
  disabled?: boolean
}

type NormalizedLanguage = Required<Pick<LanguageSwitcherOption, "code">> & LanguageSwitcherOption

type GoogleTranslateElementConstructor = new (
  options: { pageLanguage: string; includedLanguages: string },
  elementId: string
) => unknown

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: GoogleTranslateElementConstructor } }
    googleTranslateElementInit?: () => void
  }
}

const GOOGLE_TRANSLATE_SCRIPT_ID = "iimp-google-translate-script"
const GOOGLE_TRANSLATE_ELEMENT_ID = "google_translate_element"

function normalizeLanguages(languages: LanguageSwitcherProps["languages"]): NormalizedLanguage[] {
  const seen = new Set<string>()

  return languages.flatMap((language) => {
    const option = typeof language === "string" ? { code: language } : language
    const code = option.code.trim()
    const identity = code.toLowerCase()

    if (!code || seen.has(identity)) return []

    seen.add(identity)
    return [{ ...option, code }]
  })
}

function readGoogleTranslateLanguage(sourceLanguage: string): string | undefined {
  if (typeof document === "undefined") return undefined

  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith("googtrans="))

  if (!cookie) return undefined

  const value = decodeURIComponent(cookie.slice("googtrans=".length))
  const [, source, target] = value.split("/")

  return source?.toLowerCase() === sourceLanguage.toLowerCase() && target ? target.toLowerCase() : undefined
}

function writeGoogleTranslateLanguage(sourceLanguage: string, targetLanguage: string) {
  if (typeof document === "undefined" || typeof window === "undefined") return

  const value = `/${sourceLanguage}/${targetLanguage}`
  document.cookie = `googtrans=${value}; path=/; SameSite=Lax`

  // Google historically checks both the host cookie and the current-domain cookie.
  // Localhost cannot accept a domain cookie, so it only receives the host cookie above.
  const hostname = window.location.hostname
  if (hostname && hostname !== "localhost" && hostname.includes(".")) {
    document.cookie = `googtrans=${value}; path=/; domain=${hostname}; SameSite=Lax`
  }
}

function initializeGoogleWebsiteTranslator(sourceLanguage: string, languages: readonly NormalizedLanguage[]) {
  const TranslateElement = window.google?.translate?.TranslateElement
  const target = document.getElementById(GOOGLE_TRANSLATE_ELEMENT_ID)

  if (!TranslateElement || !target || target.childElementCount > 0) return

  new TranslateElement(
    {
      pageLanguage: sourceLanguage,
      includedLanguages: languages.map((language) => language.code).join(","),
    },
    GOOGLE_TRANSLATE_ELEMENT_ID
  )
}

/**
 * Compact locale selector for a DashboardHeader. It is UI-only by default: connect
 * `onValueChange` to next-intl, another i18n provider, or the optional legacy Google bridge.
 */
function LanguageSwitcher({
  languages: languageInput,
  value,
  defaultValue,
  onValueChange,
  googleTranslate,
  ariaLabel = "Seleccionar idioma",
  className,
  disabled = false,
}: LanguageSwitcherProps) {
  const languages = React.useMemo(() => normalizeLanguages(languageInput), [languageInput])
  const firstLanguage = languages[0]?.code
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? firstLanguage ?? "")
  const googleConfig = React.useMemo<GoogleTranslateConfig | undefined>(
    () => (googleTranslate ? (googleTranslate === true ? {} : googleTranslate) : undefined),
    [googleTranslate]
  )
  const googleSourceLanguage = googleConfig?.sourceLanguage ?? "es"
  const googleLoadScript = googleConfig?.loadScript ?? true
  const googleReload = googleConfig?.reload ?? true
  const selectedValue = value ?? uncontrolledValue

  React.useEffect(() => {
    if (value === undefined && firstLanguage && !languages.some((language) => language.code === uncontrolledValue)) {
      setUncontrolledValue(firstLanguage)
    }
  }, [firstLanguage, languages, uncontrolledValue, value])

  React.useEffect(() => {
    if (!googleConfig || value !== undefined) return

    const translatedLanguage = readGoogleTranslateLanguage(googleSourceLanguage)
    if (translatedLanguage && languages.some((language) => language.code.toLowerCase() === translatedLanguage)) {
      const matchedLanguage = languages.find((language) => language.code.toLowerCase() === translatedLanguage)
      if (matchedLanguage) setUncontrolledValue(matchedLanguage.code)
    }
  }, [googleConfig, googleSourceLanguage, languages, value])

  React.useEffect(() => {
    if (!googleConfig || !googleLoadScript) return

    const initialize = () => initializeGoogleWebsiteTranslator(googleSourceLanguage, languages)
    window.googleTranslateElementInit = initialize

    if (window.google?.translate?.TranslateElement) {
      initialize()
      return
    }

    const existingScript = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID) as HTMLScriptElement | null
    if (existingScript) {
      existingScript.addEventListener("load", initialize)
      return () => existingScript.removeEventListener("load", initialize)
    }

    const script = document.createElement("script")
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    script.addEventListener("load", initialize)
    document.head.append(script)

    return () => script.removeEventListener("load", initialize)
  }, [googleConfig, googleLoadScript, googleSourceLanguage, languages])

  if (languages.length < 2) return null

  function handleValueChange(nextValue: string) {
    if (!nextValue || nextValue === selectedValue) return

    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)

    if (googleConfig) {
      writeGoogleTranslateLanguage(googleSourceLanguage, nextValue)
      if (googleReload && typeof window !== "undefined") window.location.reload()
    }
  }

  return (
    <>
      {googleConfig ? <div id={GOOGLE_TRANSLATE_ELEMENT_ID} className="hidden" aria-hidden="true" /> : null}
      <ToggleGroup
        type="single"
        value={selectedValue}
        onValueChange={handleValueChange}
        variant="outline"
        size="lg"
        spacing={0}
        aria-label={ariaLabel}
        className={cn("notranslate skiptranslate rounded-lg bg-muted/50 p-0.5", className)}
      >
        {languages.map((language) => (
          <ToggleGroupItem
            key={language.code}
            value={language.code}
            aria-label={language.ariaLabel ?? language.code.toUpperCase()}
            disabled={disabled}
            className="min-w-11 px-2 text-xs font-semibold data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-sm"
          >
            {language.label ?? language.code.toUpperCase()}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  )
}

export {
  LanguageSwitcher,
  readGoogleTranslateLanguage,
  writeGoogleTranslateLanguage,
}
export type {
  GoogleTranslateConfig,
  LanguageSwitcherOption,
  LanguageSwitcherProps,
}
