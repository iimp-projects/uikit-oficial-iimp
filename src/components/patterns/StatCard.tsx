import * as React from "react"
import { cn } from "../../lib/utils"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"

type StatCardTrend = {
  value: string
  direction: "up" | "down"
}

type StatCardProps = {
  label: string
  value: string
  trend?: StatCardTrend
  /** Short text under the value (e.g. "Auditados y trazables"). */
  hint?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

function StatCard({ label, value, trend, hint, icon, className }: StatCardProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <div className="flex items-start justify-between gap-3 px-(--card-spacing)">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-6">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-2 px-(--card-spacing)">
        <span className="font-heading text-2xl font-semibold tracking-tight whitespace-nowrap text-foreground">{value}</span>
        {trend ? (
          <Badge variant={trend.direction === "up" ? "success" : "destructive"}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </Badge>
        ) : null}
        {hint ? <span className="text-sm text-muted-foreground">{hint}</span> : null}
      </div>
    </Card>
  )
}

export { StatCard }
export type { StatCardProps }
