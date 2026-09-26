import * as React from "react"
import { cn } from "cn"
import { SpinnerIcon } from "@phosphor-icons/react"

function Spinner({ className, ...props }: React.ComponentProps<typeof SpinnerIcon>) {
  return (
    <SpinnerIcon
      data-slot="spinner"
      role="status"
      aria-label="Cargando"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
