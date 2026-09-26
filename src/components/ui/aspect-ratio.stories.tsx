import type { Meta, StoryObj } from "@storybook/react-vite"
import { AspectRatio } from "./aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "Primitives/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        16:9
      </div>
    </AspectRatio>
  ),
}

export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1} className="w-40 overflow-hidden rounded-lg bg-muted">
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        1:1
      </div>
    </AspectRatio>
  ),
}
