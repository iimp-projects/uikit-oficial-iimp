import type { Meta, StoryObj } from "@storybook/react-vite"
import { InfoDialog } from "./InfoDialog"
import { Button } from "../ui/button"

const meta: Meta<typeof InfoDialog> = {
  title: "Patterns/InfoDialog",
  component: InfoDialog,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof InfoDialog>

export const Default: Story = {
  render: () => (
    <InfoDialog
      trigger={<Button variant="outline">Ver detalle</Button>}
      title="Detalle del evento"
      description="Información no destructiva sobre el registro seleccionado."
    >
      <p className="text-sm text-muted-foreground">
        Contenido informativo. Una sola acción de cierre, sin footer complejo.
      </p>
    </InfoDialog>
  ),
}
