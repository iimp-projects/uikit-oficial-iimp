import * as React from "react"
import { cn } from "cn"
import { Button, type buttonVariants } from "./button"
import type { VariantProps } from "class-variance-authority"

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-6", className)}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.4 0 10.3-1.8 14-5.1l-6.5-5.4C29.5 36.3 26.9 37 24 37c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 40.5 16.3 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.4C39.9 36.9 43 30.9 43 24c0-1.4-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}

type GoogleSignInButtonProps = Omit<React.ComponentProps<"button">, "children"> &
  Pick<VariantProps<typeof buttonVariants>, "size"> & {
    /** Defaults to "Continuar con Google". Pass your own copy (e.g. "Sign in with Google"). */
    label?: React.ReactNode
    asChild?: boolean
  }

/**
 * The Google "G" mark plus label, styled as a full-width outline Button. Only renders the button —
 * wire your own `onClick`/`formAction` (NextAuth, a Server Action, Firebase, etc.); the kit performs
 * no authentication of its own.
 */
function GoogleSignInButton({ className, label = "Continuar con Google", size = "lg", ...props }: GoogleSignInButtonProps) {
  return (
    <Button type="button" variant="outline" size={size} className={cn("w-full gap-3", className)} {...props}>
      <GoogleMark />
      {label}
    </Button>
  )
}

export { GoogleSignInButton }
export type { GoogleSignInButtonProps }
