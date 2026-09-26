import type { Meta, StoryObj } from "@storybook/react-vite"
import { LoadingState } from "./LoadingState"

const meta: Meta<typeof LoadingState> = {
  title: "Patterns/LoadingState",
  component: LoadingState,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof LoadingState>

export const Spinner: Story = {
  args: { variant: "spinner", label: "Cargando participantes" },
}

export const Skeleton: Story = {
  args: { variant: "skeleton", lines: 4 },
  render: (args) => (
    <div className="w-80">
      <LoadingState {...args} />
    </div>
  ),
}
