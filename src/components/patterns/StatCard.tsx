import * as React from "react"
import { cn } from "../../lib/utils"

type StatCardTrend = {
  value: string
  direction: "up" | "down"
}

type StatCardProps = {
  label: string
  value: string
  trend?: StatCardTrend
  icon?: React.ReactNode
  className?: string
}

function StatCard({ label, value, trend, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-heading text-2xl font-semibold">{value}</span>
        {trend ? (
          <span
            className={cn(
              "text-sm font-medium",
              trend.direction === "up" ? "text-success" : "text-destructive"
            )}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
