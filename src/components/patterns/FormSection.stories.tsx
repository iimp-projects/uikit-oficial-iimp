import type { Meta, StoryObj } from "@storybook/react-vite"
import { FormSection } from "./FormSection"
import { FormField } from "./FormField"
import { Input } from "../ui/input"

const meta: Meta<typeof FormSection> = {
  title: "Patterns/FormSection",
  component: FormSection,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FormSection>

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <FormSection title="Datos del evento" description="Información básica visible para los participantes.">
        <FormField label="Nombre del evento" required>
          <Input placeholder="Ej. Congreso IIMP 2026" />
        </FormField>
        <FormField label="Sede" description="Ciudad y lugar del evento.">
          <Input placeholder="Ej. Lima, Perú" />
        </FormField>
      </FormSection>
    </div>
  ),
}
