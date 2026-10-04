import * as React from "react"
import { cn } from "../../lib/utils"
import logoIimp from "./assets/logo-iimp.png"
import { Alert, AlertDescription } from "../ui/alert"
import { Card } from "../ui/card"
import { GoogleSignInButton } from "../ui/google-sign-in-button"
import { AuthLayout, type AuthBrandTone } from "./AuthLayout"

type LoginScreenLegalLinks = {
  privacyHref: string
  termsHref: string
}

type LoginScreenProps = {
  /** System name shown above the card on mobile. */
  systemName: React.ReactNode
  systemTagline?: React.ReactNode
  /** Small pill above the headline on the desktop brand panel. */
  eyebrow?: React.ReactNode
  headline: React.ReactNode
  description?: React.ReactNode
  features?: React.ReactNode[]
  footer?: React.ReactNode
  brandTone?: AuthBrandTone
  /** Logo inside the card. Defaults to the IIMP logo bundled with the UI Kit. */
  logoSrc?: string
  logoAlt?: string
  /** Card heading. Defaults to "Iniciar Sesión". */
  title?: React.ReactNode
  /** Text under the card heading. */
  subtitle?: React.ReactNode
  /** Sign-in label. Defaults to "Continuar con Google". */
  signInLabel?: string
  /** Label shown while `loading` is true. */
  loadingLabel?: string
  /** Disables the button and shows `loadingLabel`. */
  loading?: boolean
  /** Click handler. Use it for client-side providers; the kit performs no authentication. */
  onSignIn?: React.MouseEventHandler<HTMLButtonElement>
  /** Form action (URL or Server Action) submitted by the button. */
  action?: React.ComponentProps<"form">["action"]
  /** Error shown above the button (for example `?error=` mapped by the app). */
  error?: React.ReactNode
  /** Shows "Al continuar, aceptas…" with both links when provided. */
  legal?: LoginScreenLegalLinks
  /** Link component, for example `next/link`. Defaults to a plain anchor. */
  LinkComponent?: React.ElementType
  className?: string
}

/**
 * Complete login screen: AuthLayout brand panel plus a centered card with logo, title, optional
 * error, Google button and legal links. The app only supplies copy and the sign-in handler.
 */
function LoginScreen({
  systemName,
  systemTagline,
  eyebrow,
  headline,
  description,
  features,
  footer,
  brandTone = "primary",
  logoSrc = logoIimp,
  logoAlt = "Instituto de Ingenieros de Minas del Perú",
  title = "Iniciar Sesión",
  subtitle,
  signInLabel = "Continuar con Google",
  loadingLabel = "Conectando…",
  loading = false,
  onSignIn,
  action,
  error,
  legal,
  LinkComponent = "a",
  className,
}: LoginScreenProps) {
  const button = (
    <GoogleSignInButton
      type={action ? "submit" : "button"}
      disabled={loading}
      label={loading ? loadingLabel : signInLabel}
      onClick={onSignIn}
    />
  )

  return (
    <AuthLayout
      brandTone={brandTone}
      systemName={systemName}
      systemTagline={systemTagline}
      eyebrow={eyebrow}
      headline={headline}
      description={description}
      features={features}
      footer={footer}
      className={className}
    >
      <Card
        className={cn(
          "flex w-full flex-col items-center gap-6 p-8 text-center shadow-lg",
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <img src={logoSrc} alt={logoAlt} className="h-[50px] w-auto" />
          <h2 className="font-heading text-2xl font-bold">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          {action ? (
            <form action={action} aria-busy={loading}>
              {button}
            </form>
          ) : (
            button
          )}
          {legal ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Al continuar, aceptas nuestras{" "}
              <LinkComponent href={legal.privacyHref} className="underline">
                Políticas de Privacidad
              </LinkComponent>{" "}
              y{" "}
              <LinkComponent href={legal.termsHref} className="underline">
                Términos de Uso
              </LinkComponent>
              .
            </p>
          ) : null}
        </div>
      </Card>
    </AuthLayout>
  )
}

export { LoginScreen }
export type { LoginScreenLegalLinks, LoginScreenProps }
