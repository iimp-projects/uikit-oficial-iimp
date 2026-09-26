import * as React from "react"
import { Spinner } from "../ui/spinner"
import { Skeleton } from "../ui/skeleton"
import { cn } from "../../lib/utils"

type LoadingStateProps = {
  variant?: "spinner" | "skeleton"
  label?: string
  lines?: number
  className?: string
}

function LoadingState({
  variant = "spinner",
  label = "Cargando",
  lines = 3,
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("flex flex-col gap-2", className)} role="status" aria-busy="true" aria-label={label}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full last:w-2/3" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn("flex items-center justify-center gap-2 py-8 text-muted-foreground", className)}
      aria-busy="true"
    >
      <Spinner />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export { LoadingState }
export type { LoadingStateProps }
