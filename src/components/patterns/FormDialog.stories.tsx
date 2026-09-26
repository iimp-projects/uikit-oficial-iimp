import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FormDialog } from "./FormDialog"
import { Button } from "../ui/button"

const meta: Meta<typeof FormDialog> = {
  title: "Patterns/FormDialog",
  component: FormDialog,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FormDialog>

export const Default: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setLoading(false)
    }

    return (
      <FormDialog
        trigger={<Button>Crear participante</Button>}
        title="Crear participante"
        description="Completa los datos del participante para el evento."
        submitLabel="Guardar"
        loading={loading}
        onSubmit={handleSubmit}
      >
        <p className="text-sm text-muted-foreground">
          Aquí van los campos del formulario (Input, Select, etc. de official-uikit-iimp).
        </p>
      </FormDialog>
    )
  },
}
