import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "./separator"

const meta: Meta<typeof Separator> = {
  title: "Primitives/Separator",
  component: Separator,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Datos del participante</p>
      <Separator className="my-3" />
      <p className="text-sm text-muted-foreground">Datos de facturación</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 text-sm">
      <span>Agenda</span>
      <Separator orientation="vertical" />
      <span>Ponentes</span>
      <Separator orientation="vertical" />
      <span>Sedes</span>
    </div>
  ),
}
