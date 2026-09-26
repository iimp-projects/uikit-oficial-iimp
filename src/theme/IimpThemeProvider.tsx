import * as React from "react"
import { cn } from "cn"

type IimpTheme = {
  primary: string
  secondary: string
  radius?: string
  primaryForeground?: string
  secondaryForeground?: string
}

const WHITE = "oklch(0.985 0 0)"
const NAVY = "oklch(0.2474 0.0706 258.37)"
// Relative luminance of NAVY (oklch 0.2474 0.0706 258.37 ≈ #092042)
const NAVY_LUMINANCE = 0.0141
const RADIUS_PATTERN = /^-?\d*\.?\d+(px|rem|em)$/

function resolveForeground(colorValue: string): string {
  if (typeof document === "undefined") return WHITE

  try {
    const probe = document.createElement("span")
    probe.style.color = colorValue
    probe.style.position = "absolute"
    probe.style.visibility = "hidden"
    probe.style.pointerEvents = "none"
    document.body.appendChild(probe)
    const computed = getComputedStyle(probe).color
    document.body.removeChild(probe)

    const match = computed.match(/rgba?\(([^)]+)\)/)
    if (!match) return WHITE

    const [r, g, b] = match[1].split(",").map((n) => parseFloat(n.trim()))
    if ([r, g, b].some((n) => Number.isNaN(n))) return WHITE

    const toLinear = (channel: number) => {
      const c = channel / 255
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

    // WCAG contrast: (L1 + 0.05) / (L2 + 0.05). Pick the foreground with the higher ratio.
    const contrastWithWhite = 1.05 / (luminance + 0.05)
    const contrastWithNavy = (luminance + 0.05) / (NAVY_LUMINANCE + 0.05)

    return contrastWithNavy > contrastWithWhite ? NAVY : WHITE
  } catch {
    return WHITE
  }
}

const IimpThemeContext = React.createContext<IimpTheme | null>(null)

function useIimpTheme() {
  return React.useContext(IimpThemeContext)
}

type IimpThemeProviderProps = {
  theme: IimpTheme
  children: React.ReactNode
  className?: string
}

function IimpThemeProvider({ theme, children, className }: IimpThemeProviderProps) {
  const style = React.useMemo<React.CSSProperties>(() => {
    const vars: Record<string, string> = {
      "--primary": theme.primary,
      "--primary-foreground": theme.primaryForeground ?? resolveForeground(theme.primary),
      "--secondary": theme.secondary,
      "--secondary-foreground": theme.secondaryForeground ?? resolveForeground(theme.secondary),
    }

    const radius = theme.radius?.trim()
    if (radius && RADIUS_PATTERN.test(radius)) {
      vars["--radius"] = radius
    }

    return vars as React.CSSProperties
  }, [theme.primary, theme.secondary, theme.radius, theme.primaryForeground, theme.secondaryForeground])

  return (
    <IimpThemeContext.Provider value={theme}>
      <div data-slot="iimp-theme-provider" className={cn("contents", className)} style={style}>
        {children}
      </div>
    </IimpThemeContext.Provider>
  )
}

export { IimpThemeProvider, useIimpTheme }
export type { IimpTheme }
