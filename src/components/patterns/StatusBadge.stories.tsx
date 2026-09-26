import type { Meta, StoryObj } from "@storybook/react-vite"
import { StatusBadge } from "./StatusBadge"

const meta: Meta<typeof StatusBadge> = {
  title: "Patterns/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof StatusBadge>

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="success">Confirmado</StatusBadge>
      <StatusBadge status="warning">Pendiente</StatusBadge>
      <StatusBadge status="destructive">Cancelado</StatusBadge>
      <StatusBadge status="info">En revisión</StatusBadge>
      <StatusBadge status="secondary">Borrador</StatusBadge>
    </div>
  ),
}
