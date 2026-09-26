import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

type FormDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  cancelLabel?: string
  submitLabel: string
  onSubmit: () => void | Promise<void>
  loading?: boolean
  submitDisabled?: boolean
  className?: string
}

function FormDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  cancelLabel = "Cancelar",
  submitLabel,
  onSubmit,
  loading = false,
  submitDisabled = false,
  className,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!loading) void onSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <div className="max-h-[60vh] overflow-y-auto">{children}</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                {cancelLabel}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || submitDisabled} aria-busy={loading}>
              {loading ? <Spinner /> : null}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { FormDialog }
export type { FormDialogProps }
