import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScrollArea } from "./scroll-area"

const meta: Meta<typeof ScrollArea> = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-lg border p-4">
      {Array.from({ length: 20 }, (_, index) => (
        <p key={index} className="text-sm">
          Línea de contenido {index + 1}
        </p>
      ))}
    </ScrollArea>
  ),
}
