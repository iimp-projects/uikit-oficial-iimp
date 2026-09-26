import * as React from "react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

type ErrorStateRetry = {
  label: string
  onClick: () => void
}

type ErrorStateProps = {
  variant?: "page" | "inline"
  title: string
  description?: string
  retry?: ErrorStateRetry
  className?: string
}

function ErrorState({
  variant = "page",
  title,
  description,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-2 text-center",
        variant === "page" ? "px-6 py-12" : "px-3 py-4",
        className
      )}
    >
      <h3 className={cn("font-heading font-semibold", variant === "page" ? "text-base" : "text-sm")}>
        {title}
      </h3>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {retry ? (
        <Button type="button" variant="outline" className="mt-2" onClick={retry.onClick}>
          {retry.label}
        </Button>
      ) : null}
    </div>
  )
}

export { ErrorState }
export type { ErrorStateProps }
