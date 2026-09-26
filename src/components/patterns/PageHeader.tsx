import * as React from "react"

type PageHeaderProps = {
  title: string
  description?: string
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

function PageHeader({ title, description, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={className}>
      {breadcrumb ? <div className="mb-3">{breadcrumb}</div> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-base text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}

export { PageHeader }
export type { PageHeaderProps }
