import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"
import { Label } from "./label"

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id="story-terms"
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true)}
        />
        <Label htmlFor="story-terms">Acepto los términos del evento</Label>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="story-terms-disabled" disabled />
      <Label htmlFor="story-terms-disabled">No disponible</Label>
    </div>
  ),
}
