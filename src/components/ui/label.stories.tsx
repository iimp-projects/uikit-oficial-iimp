import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "./label"
import { Input } from "./input"

const meta: Meta<typeof Label> = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="story-name">Nombre completo</Label>
      <Input id="story-name" placeholder="Ana Torres" />
    </div>
  ),
}
