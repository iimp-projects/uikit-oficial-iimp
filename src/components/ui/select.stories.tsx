import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("perumin")
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-56" aria-label="Evento">
          <SelectValue placeholder="Selecciona un evento" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Eventos 2026</SelectLabel>
            <SelectItem value="perumin">PERUMIN</SelectItem>
            <SelectItem value="expomina">ExpoMina</SelectItem>
            <SelectItem value="proexplo">Proexplo</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Archivo</SelectLabel>
            <SelectItem value="extemin">Extemin</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  },
}

export const Small: Story = {
  render: () => (
    <Select defaultValue="perumin">
      <SelectTrigger size="sm" className="w-56" aria-label="Evento">
        <SelectValue placeholder="Selecciona un evento" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="perumin">PERUMIN</SelectItem>
        <SelectItem value="expomina">ExpoMina</SelectItem>
      </SelectContent>
    </Select>
  ),
}
