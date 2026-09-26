import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SearchField } from "./SearchField"

const meta: Meta<typeof SearchField> = {
  title: "Patterns/SearchField",
  component: SearchField,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SearchField>

export const Default: Story = {
  render: () => {
    const [result, setResult] = React.useState("")
    return (
      <div className="flex w-80 flex-col gap-2">
        <SearchField placeholder="Buscar participante…" onSearch={setResult} />
        <p className="text-xs text-muted-foreground">Buscando: {result || "(vacío)"}</p>
      </div>
    )
  },
}
