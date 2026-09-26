import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { FilterBar } from "./FilterBar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { SearchField } from "./SearchField"

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
