import * as React from "react"
import { Badge } from "../ui/badge"

type StatusBadgeStatus = "success" | "warning" | "destructive" | "info" | "default" | "secondary"

type StatusBadgeProps = {
  status: StatusBadgeStatus
  children: React.ReactNode
  className?: string
}

function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge variant={status} className={className}>
      {children}
    </Badge>
  )
}

export { StatusBadge }
export type { StatusBadgeProps, StatusBadgeStatus }
