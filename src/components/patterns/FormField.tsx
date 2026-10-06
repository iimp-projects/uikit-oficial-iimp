import * as React from "react"
import { Label } from "../ui/label"
import { cn } from "../../lib/utils"

type FormFieldProps = {
  label: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactElement
  className?: string
}

function FormField({
  label,
  description,
  error,
  required = false,
  children,
  className,
}: FormFieldProps) {
  const generatedId = React.useId()
  const controlId = (children.props as { id?: string }).id ?? generatedId
  const descriptionId = description ? `${controlId}-description` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined

  const control = React.cloneElement(children, {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    "aria-required": required ? true : undefined,
  } as React.HTMLAttributes<HTMLElement>)

  return (
    // Four fixed rows (label, description, control, error). Inside a FormGrid the field becomes a
    // subgrid, so neighbouring fields share these rows and their controls line up even when one
    // has a description, a wrapped label or an error. Outside a grid it behaves like a plain stack.
    <div
      data-slot="form-field"
      className={cn("grid min-w-0 grid-rows-subgrid row-span-4 gap-y-0", className)}
    >
      <Label htmlFor={controlId} className="row-start-1 mb-1.5">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {description ? (
        <p id={descriptionId} className="row-start-2 mb-1.5 text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="row-start-3 min-w-0 [&>[data-slot=select-trigger]]:w-full">{control}</div>
      {error ? (
        <p id={errorId} role="alert" className="row-start-4 mt-1.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
