import type { Meta, StoryObj } from "@storybook/react-vite"
import { WarningIcon } from "@phosphor-icons/react"
import { Alert, AlertTitle, AlertDescription } from "./alert"

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Actualización disponible</AlertTitle>
      <AlertDescription>
        Hay una nueva versión del sistema. Guarda tus cambios antes de continuar.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <WarningIcon />
      <AlertTitle>No se pudo guardar</AlertTitle>
      <AlertDescription>
        Revisa tu conexión e inténtalo de nuevo.
      </AlertDescription>
    </Alert>
  ),
}
