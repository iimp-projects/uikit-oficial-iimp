import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"
import { Toaster } from "./sonner"
import { Button } from "./button"

const meta: Meta<typeof Toaster> = {
  title: "Primitives/Sonner",
  component: Toaster,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Default: Story = {
  render: () => (
    <div>
      <Button onClick={() => toast("Cambios guardados")}>Mostrar toast</Button>
      <Button
        variant="destructive"
        className="ml-2"
        onClick={() => toast.error("No se pudo guardar")}
      >
        Mostrar error
      </Button>
      <Toaster />
    </div>
  ),
}
