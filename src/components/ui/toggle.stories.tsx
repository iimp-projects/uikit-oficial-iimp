import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { TextBolderIcon } from "@phosphor-icons/react"
import { Toggle } from "./toggle"

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => {
    const [pressed, setPressed] = React.useState(false)
    return (
      <Toggle pressed={pressed} onPressedChange={setPressed} aria-label="Negrita">
        <TextBolderIcon />
      </Toggle>
    )
  },
}

export const Outline: Story = {
  args: { variant: "outline", "aria-label": "Negrita", children: <TextBolderIcon /> },
}

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "Negrita", children: <TextBolderIcon /> },
}
