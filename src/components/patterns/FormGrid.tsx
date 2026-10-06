import * as React from "react"
import { cn } from "../../lib/utils"

type FormGridProps = React.ComponentProps<"div"> & {
  /**
   * Smallest comfortable width of one field. The grid fits as many columns as the container's
   * own width allows (1 in a narrow drawer, 3-4 in a wide page) and stretches the fields to fill
   * every row, so no field ever sits in a cell narrower than this and no row leaves an empty gap.
   * Defaults to `14rem`.
   */
  minFieldWidth?: string
}

/**
 * Responsive grid for `FormField`s. Columns come from the available width of the container, not
 * from the viewport, so the same form works in a 360px drawer and in a full page. Use
 * `className="col-span-full"` on a field that needs its own row (textareas, long notes). Fields
 * in the same row line their controls up even when one has a description or an error.
 */
function FormGrid({ minFieldWidth = "14rem", className, style, ...props }: FormGridProps) {
  return (
    <div
      data-slot="form-grid"
      className={cn("grid gap-x-4 gap-y-4", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minFieldWidth}), 1fr))`,
        ...style,
      }}
      {...props}
    />
  )
}

export { FormGrid }
export type { FormGridProps }
