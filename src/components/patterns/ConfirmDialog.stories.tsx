import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ConfirmDialog } from "./ConfirmDialog"
import { Button } from "../ui/button"

const meta: Meta<typeof ConfirmDialog> = {
  title: "Patterns/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleConfirm = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setLoading(false)
      setOpen(false)
    }

    return (
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="secondary">Cerrar inscripciones</Button>}
        title="Cerrar inscripciones"
        description="No se podrán registrar nuevos participantes para este evento."
        confirmLabel="Cerrar inscripciones"
        loading={loading}
        onConfirm={handleConfirm}
      />
    )
  },
}
