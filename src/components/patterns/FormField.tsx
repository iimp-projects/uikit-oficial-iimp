import * as React from "react"
import { QuestionMarkIcon } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../../lib/utils"

type FormFieldProps = {
  label: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactElement
  className?: string
}

const HELP_CLOSE_DELAY_MS = 120

/**
 * Help icon next to the label. Hover (mouse) shows the description; click/tap/Enter pins it open
 * until a second click, Escape or an outside click. The same text stays available to assistive
 * technology through the control's `aria-describedby`, so nothing is lost by moving it off-screen.
 */
function FieldHelp({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [pinned, setPinned] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const cancelClose = () => clearTimeout(timer.current)
  const hoverOpen = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return
    cancelClose()
    setOpen(true)
  }
  const hoverClose = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse" || pinned) return
    cancelClose()
    timer.current = setTimeout(() => setOpen(false), HELP_CLOSE_DELAY_MS)
  }
  React.useEffect(() => cancelClose, [])

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setPinned(false)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          data-slot="form-field-help"
          aria-label={`Ayuda sobre ${label}`}
          // Bare 16px box (no border, no background) so it sits centred on the label line; the
          // invisible ::after extends the touch target to 40px.
          className="relative size-4 min-h-0 rounded-full border-0 bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent after:absolute after:-inset-3 after:content-['']"
          onPointerEnter={hoverOpen}
          onPointerLeave={hoverClose}
          onClick={(event) => {
            event.preventDefault()
            const next = !pinned
            setPinned(next)
            setOpen(next)
          }}
        >
          <QuestionMarkIcon weight="bold" className="size-3" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-64"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onPointerEnter={cancelClose}
        onPointerLeave={hoverClose}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
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
    // Three fixed rows (label, control, error). The description lives in a help popover next to the
    // label, so it never adds a row. Inside a FormGrid the field becomes a subgrid, so neighbouring
    // fields share these rows and their controls line up even with a wrapped label or an error.
    // Outside a grid it behaves like a plain stack.
    <div
      data-slot="form-field"
      className={cn("grid min-w-0 grid-rows-subgrid row-span-3 gap-y-0", className)}
    >
      <div className="row-start-1 mb-1.5 flex min-w-0 items-center gap-1.5">
        <Label htmlFor={controlId}>
          {label}
          {required ? <span className="text-destructive">*</span> : null}
        </Label>
        {description ? <FieldHelp label={label}>{description}</FieldHelp> : null}
      </div>
      {description ? (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      ) : null}
      <div className="row-start-2 min-w-0 [&>[data-slot=select-trigger]]:w-full">{control}</div>
      {error ? (
        <p id={errorId} role="alert" className="row-start-3 mt-1.5 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
