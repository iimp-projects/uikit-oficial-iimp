import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  TextBolderIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

const meta: Meta<typeof ToggleGroup> = {
  title: "Primitives/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(["bold"])
    return (
      <ToggleGroup type="multiple" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="bold" aria-label="Negrita">
          <TextBolderIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Cursiva">
          <TextItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Subrayado">
          <TextUnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    )
  },
}

export const Outline: Story = {
  render: () => {
    const [value, setValue] = React.useState("bold")
    return (
      <ToggleGroup type="single" variant="outline" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="bold" aria-label="Negrita">
          <TextBolderIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Cursiva">
          <TextItalicIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    )
  },
}
