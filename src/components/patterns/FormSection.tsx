import * as React from "react"
import { cn } from "../../lib/utils"

type FormSectionProps = {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

export { FormSection }
export type { FormSectionProps }
