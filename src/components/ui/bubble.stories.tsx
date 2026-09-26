import type { Meta, StoryObj } from "@storybook/react-vite"
import { BubbleGroup, Bubble, BubbleContent } from "./bubble"

const meta: Meta<typeof Bubble> = {
  title: "Primitives/Bubble",
  component: Bubble,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Bubble>

export const Default: Story = {
  render: () => (
    <BubbleGroup className="max-w-sm">
      <Bubble align="start" variant="muted">
        <BubbleContent>¿A qué hora empieza la conferencia?</BubbleContent>
      </Bubble>
      <Bubble align="end" variant="default">
        <BubbleContent>Empieza a las 9:00 am en el auditorio principal.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
}
