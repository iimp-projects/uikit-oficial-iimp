import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./input"

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: "nombre@correo.com", type: "email" },
}

export const Disabled: Story = {
  args: { placeholder: "No editable", disabled: true },
}

export const Invalid: Story = {
  args: {
    placeholder: "nombre@correo.com",
    defaultValue: "correo-invalido",
    "aria-invalid": true,
  },
}
