import type { Meta, StoryObj } from "@storybook/react-vite"
import { Kbd, KbdGroup } from "./kbd"

const meta: Meta<typeof Kbd> = {
  title: "Primitives/Kbd",
  component: Kbd,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {
  args: { children: "⌘" },
}

export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}
