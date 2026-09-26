import * as React from "react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

type FilterBarProps = {
  children: React.ReactNode
  activeCount?: number
  onClear?: () => void
  clearLabel?: string
  className?: string
}

function FilterBar({
  children,
  activeCount,
  onClear,
  clearLabel = "Limpiar filtros",
  className,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}
      {typeof activeCount === "number" && activeCount > 0 ? (
        <span className="text-sm text-muted-foreground">
          {activeCount} {activeCount === 1 ? "filtro activo" : "filtros activos"}
        </span>
      ) : null}
      {onClear ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          {clearLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { FilterBar }
export type { FilterBarProps }
