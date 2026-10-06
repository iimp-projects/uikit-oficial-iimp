import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FilterBar } from "./FilterBar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { SearchField } from "./SearchField"
import { Button } from "../ui/button"

const meta: Meta<typeof FilterBar> = {
  title: "Patterns/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FilterBar>

export const Default: Story = {
  render: () => {
    const [activeCount, setActiveCount] = React.useState(1)
    return (
      <FilterBar activeCount={activeCount} onClear={() => setActiveCount(0)}>
        <SearchField placeholder="Buscar…" className="w-64" />
        <Select defaultValue="active" onValueChange={() => setActiveCount(1)}>
          <SelectTrigger className="w-40" aria-label="Estado">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>
    )
  },
}

// Filtro completo: buscador + varios Select + botón, todos en una fila que envuelve (no uno por fila).
export const Completo: Story = {
  render: () => (
    <FilterBar>
      <SearchField placeholder="Buscar nombre o correo" className="w-64" />
      {["Todas las áreas", "Todos los estados", "Todos los roles"].map((label) => (
        <Select key={label} defaultValue="todos">
          <SelectTrigger className="w-48" aria-label={label}>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">{label}</SelectItem>
            <SelectItem value="uno">Opción</SelectItem>
          </SelectContent>
        </Select>
      ))}
      <Button type="button">Filtrar</Button>
    </FilterBar>
  ),
}
