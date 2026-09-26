import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("presencial")
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="presencial" id="story-presencial" />
          <Label htmlFor="story-presencial">Presencial</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="virtual" id="story-virtual" />
          <Label htmlFor="story-virtual">Virtual</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="hibrido" id="story-hibrido" />
          <Label htmlFor="story-hibrido">Híbrido</Label>
        </div>
      </RadioGroup>
    )
  },
}
