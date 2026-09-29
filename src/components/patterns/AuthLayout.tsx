import * as React from "react"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"

type AuthLayoutProps = {
  /** System name, e.g. "IIMP Tesorería". Mobile header only (above the card). */
  systemName: React.ReactNode
  /** Short line under the system name. Mobile header only. */
  systemTagline?: React.ReactNode
  /** Small pill above the headline (e.g. "Sistema de Constancias de Detracciones"). Desktop only. */
  eyebrow?: React.ReactNode
  /** Large headline. Desktop brand panel only. */
  headline: React.ReactNode
  /** Paragraph under the headline. Desktop brand panel only. */
  description?: React.ReactNode
  /** Checklist of feature bullets under the description. Desktop brand panel only. */
  features?: React.ReactNode[]
  /** Small print at the bottom of the brand panel. Desktop only. */
  footer?: React.ReactNode
  /** The actual login card/form: logo, heading, description, sign-in button(s) — composed by the app. */
  children: React.ReactNode
  className?: string
}

/** The two soft blooms behind the brand panel content — same pair on desktop and mobile. */
function DecorativeCircles() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-96 rounded-full bg-primary-foreground/5"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 size-64 rounded-full bg-primary-foreground/5"
      />
    </>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-6 shrink-0">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/**
 * Two-column, mobile-first shell for a login screen. Desktop (`lg` and up): a full-height brand
 * panel on the left (eyebrow, headline, description, features, footer, two soft decorative blooms)
 * and the app's own login card (passed as `children`, carrying its own logo/heading) centered on
 * the right, on a plain background. Mobile: the brand panel collapses to just the system name — but
 * the same decorative blooms carry over, so the screen reads as one branded surface, not a plain
 * block of color — with the login card centered on top. Ships no authentication of its own — pair
 * it with `GoogleSignInButton` (or your own sign-in control) inside `children`. See
 * docs/03_UX_RULES.md "AuthLayout" for a full recipe.
 */
function AuthLayout({
  systemName,
  systemTagline,
  eyebrow,
  headline,
  description,
  features,
  footer,
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background lg:grid lg:grid-cols-2", className)}>
      {/* Desktop-only brand panel. */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <DecorativeCircles />
        {eyebrow ? (
          <Badge variant="outline" className="w-fit border-primary-foreground/25 text-primary-foreground/90">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="relative flex max-w-md flex-col gap-5">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance xl:text-4xl">
            {headline}
          </h1>
          {description ? (
            <p className="leading-relaxed text-primary-foreground/70">{description}</p>
          ) : null}
          {features?.length ? (
            <ul className="flex flex-col gap-3 pt-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2.5 text-primary-foreground/85">
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative text-primary-foreground/50">{footer}</div>
      </div>

      {/* Mobile: full bg-primary with the same decorative blooms, logo + system name, card
          centered on top — logo and card share one column so both line up.
          Desktop: plain background, same centered card, in its own column. */}
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary p-6 text-primary-foreground sm:p-10 lg:min-h-0 lg:bg-background lg:text-foreground lg:p-10">
        <div className="lg:hidden">
          <DecorativeCircles />
        </div>
        <div className="relative flex w-full max-w-sm flex-col items-center gap-8">
          <div className="self-center text-center lg:hidden">
            <div className="text-2xl font-black tracking-tight">{systemName}</div>
            {systemTagline ? <div className="text-sm text-primary-foreground/70">{systemTagline}</div> : null}
          </div>
          <div className="flex w-full flex-col gap-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export { AuthLayout }
export type { AuthLayoutProps }
