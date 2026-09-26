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

type InfoDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
  closeLabel?: string
  className?: string
}

function InfoDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  closeLabel = "Cerrar",
  className,
}: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children ? <div className="max-h-[60vh] overflow-y-auto">{children}</div> : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {closeLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { InfoDialog }
export type { InfoDialogProps }
