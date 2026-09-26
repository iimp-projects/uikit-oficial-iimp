import type { Meta, StoryObj } from "@storybook/react-vite"
import { Progress } from "./progress"

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: { value: 65 },
  render: (args) => <Progress aria-label="Avance de inscripción" {...args} className="w-64" />,
}
