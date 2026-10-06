import type { Meta, StoryObj } from "@storybook/react-vite"
import { FormField } from "./FormField"
import { FormGrid } from "./FormGrid"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"

const meta: Meta<typeof FormGrid> = {
  title: "Patterns/FormGrid",
  component: FormGrid,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FormGrid>

function Fields() {
  return (
    <>
      <FormField label="RUC" required>
        <Input defaultValue="20614865980" />
      </FormField>
      <FormField label="Razón social">
        <Input defaultValue="AIRQUALITY MULTISERVICE MI E.I.R.L." />
      </FormField>
      <FormField label="Correo(s) para constancias" description="Varios correos separados por coma.">
        <Input placeholder="tesoreria@empresa.com.pe" />
      </FormField>
      <FormField label="Persona de contacto">
        <Input placeholder="Nombre y apellido" />
      </FormField>
      <FormField label="Teléfono" error="Ingresa un teléfono válido.">
        <Input placeholder="+51 999 999 999" />
      </FormField>
      <FormField label="Dirección fiscal">
        <Input placeholder="Av. / Jr. / Distrito" />
      </FormField>
      <FormField label="Notas internas" description="Solo visibles para Tesorería." className="col-span-full">
        <Textarea placeholder="Condiciones de pago, acuerdos, observaciones…" />
      </FormField>
    </>
  )
}

// El número de columnas sale del ancho del contenedor: 1 en un drawer angosto, 2-3 en una página.
export const Wide: Story = {
  render: () => (
    <div className="w-[960px] max-w-full">
      <FormGrid>
        <Fields />
      </FormGrid>
    </div>
  ),
}

export const NarrowDrawer: Story = {
  render: () => (
    <div className="w-[360px] max-w-full">
      <FormGrid>
        <Fields />
      </FormGrid>
    </div>
  ),
}

// Select y campos con descripción: el Select llena su celda y los controles quedan alineados.
export const WithSelectAndDescriptions: Story = {
  render: () => (
    <div className="w-[720px] max-w-full">
      <FormGrid>
        <FormField label="Nombre" required>
          <Input defaultValue="Bronce" />
        </FormField>
        <FormField label="División" description="Opcional. Ej.: III, II, I.">
          <Input defaultValue="III" />
        </FormField>
        <FormField
          label="Puntaje mínimo (XP)"
          required
          description="Desde cuántos XP se alcanza este rango. El tope se calcula con el siguiente rango."
        >
          <Input defaultValue="0" />
        </FormField>
        <FormField label="Estado" required>
          <Select defaultValue="activo">
            <SelectTrigger aria-label="Estado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormGrid>
    </div>
  ),
}
