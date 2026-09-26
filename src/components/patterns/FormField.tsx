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
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={controlId}>
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {description ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
