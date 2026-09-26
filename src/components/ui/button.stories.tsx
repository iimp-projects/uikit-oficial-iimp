import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon", "icon-lg"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: "Guardar", variant: "default" },
}

export const Secondary: Story = {
  args: { children: "Acción secundaria", variant: "secondary" },
}

export const Outline: Story = {
  args: { children: "Cancelar", variant: "outline" },
}

export const Ghost: Story = {
  args: { children: "Acción terciaria", variant: "ghost" },
}

export const Destructive: Story = {
  args: { children: "Eliminar", variant: "destructive" },
}

export const Link: Story = {
  args: { children: "Ver detalle", variant: "link" },
}

export const Disabled: Story = {
  args: { children: "Guardar", disabled: true },
}
