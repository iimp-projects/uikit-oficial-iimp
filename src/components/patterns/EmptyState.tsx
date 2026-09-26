import * as React from "react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

type EmptyStateAction = {
  label: string
  onClick: () => void
}

type EmptyStateProps = {
  title: string
  description?: string
  media?: React.ReactNode
  primaryAction?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  className?: string
}

function EmptyState({
  title,
  description,
  media,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      {media ? <div className="text-muted-foreground">{media}</div> : null}
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-xl font-semibold">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {primaryAction || secondaryAction ? (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          {secondaryAction ? (
            <Button type="button" variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button type="button" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
