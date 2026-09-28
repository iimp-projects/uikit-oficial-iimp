import * as React from "react"
import { cn } from "../../lib/utils"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"

type DataCardProps = {
  title: string
  description?: string
  /** Round icon shown before the title. */
  icon?: React.ReactNode
  /** Small node next to the title (e.g. a count Badge). */
  meta?: React.ReactNode
  /** Right side of the header: search, filters, buttons. */
  actions?: React.ReactNode
  /** Table, list or any content. It goes edge to edge below the header. */
  children: React.ReactNode
  className?: string
}

/** Card for data screens: header (title, meta, actions) + separator + full-width table. */
function DataCard({ title, description, icon, meta, actions, children, className }: DataCardProps) {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex min-w-0 flex-1 basis-80 items-center gap-4">
          {icon ? (
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-6">
              {icon}
            </span>
          ) : null}
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">{title}</h2>
              {meta}
            </div>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      <Separator />
      <div className="min-w-0 px-2 pb-2">{children}</div>
    </Card>
  )
}

export { DataCard }
export type { DataCardProps }
