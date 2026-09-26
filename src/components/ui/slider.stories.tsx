import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "./slider"

const meta: Meta<typeof Slider> = {
  title: "Primitives/Slider",
  component: Slider,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState([50])

    return <Slider className="w-64" value={value} onValueChange={setValue} />
  },
}

export const Range: Story = {
  render: () => {
    const [value, setValue] = React.useState([25, 75])

    return <Slider className="w-64" value={value} onValueChange={setValue} />
  },
}
