import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox"

const eventos = ["PERUMIN", "ExpoMina", "Proexplo", "Extemin", "Perumin Junior"]

const meta: Meta<typeof Combobox> = {
  title: "Primitives/Combobox",
  component: Combobox,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null)
    return (
      <Combobox items={eventos} value={value} onValueChange={setValue}>
        <ComboboxInput placeholder="Buscar evento..." aria-label="Evento" />
        <ComboboxContent>
          <ComboboxEmpty>Sin resultados.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
  },
}
