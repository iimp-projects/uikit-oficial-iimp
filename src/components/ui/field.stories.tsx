import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./field"
import { Input } from "./input"

const meta: Meta<typeof Field> = {
  title: "Primitives/Field",
  component: Field,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Field>

export const Default: Story = {
  render: () => (
    <Field className="w-72">
      <FieldContent>
        <FieldLabel htmlFor="story-field-name">Nombre visible</FieldLabel>
        <Input id="story-field-name" placeholder="Ana Torres" />
        <FieldDescription>Nombre mostrado al participante.</FieldDescription>
      </FieldContent>
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field className="w-72" data-invalid="true">
      <FieldContent>
        <FieldLabel htmlFor="story-field-email">Correo</FieldLabel>
        <Input
          id="story-field-email"
          defaultValue="correo-invalido"
          aria-invalid
        />
        <FieldError>Ingresa un correo válido.</FieldError>
      </FieldContent>
    </Field>
  ),
}

export const Set: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Datos de contacto</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="story-set-name">Nombre</FieldLabel>
            <Input id="story-set-name" placeholder="Ana Torres" />
          </FieldContent>
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="story-set-email">Correo</FieldLabel>
            <Input id="story-set-email" type="email" placeholder="ana@correo.com" />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}
