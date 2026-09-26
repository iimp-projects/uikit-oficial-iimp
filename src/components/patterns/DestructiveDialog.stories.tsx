import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { DestructiveDialog } from "./DestructiveDialog"
import { Button } from "../ui/button"

const meta: Meta<typeof DestructiveDialog> = {
  title: "Patterns/DestructiveDialog",
  component: DestructiveDialog,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DestructiveDialog>

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
      <DestructiveDialog
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="destructive">Eliminar participante</Button>}
        title="Eliminar participante"
        description="Esta acción no se puede deshacer. Se eliminará el registro y su historial de asistencia."
        confirmLabel="Eliminar participante"
        loading={loading}
        onConfirm={handleConfirm}
      />
    )
  },
}
