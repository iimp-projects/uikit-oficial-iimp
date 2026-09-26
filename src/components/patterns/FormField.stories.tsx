import type { Meta, StoryObj } from "@storybook/react-vite"
import { FormField } from "./FormField"
import { Input } from "../ui/input"

const meta: Meta<typeof FormField> = {
  title: "Patterns/FormField",
  component: FormField,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="Nombre del participante" description="Como aparecerá en la credencial." required>
        <Input placeholder="Ej. María López" />
      </FormField>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="Correo" required error="Ingresa un correo válido.">
        <Input type="email" defaultValue="no-es-un-correo" />
      </FormField>
    </div>
  ),
}
