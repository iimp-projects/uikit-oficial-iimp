import type { Meta, StoryObj } from "@storybook/react-vite"
import { DirectionProvider } from "./direction"
import { Button } from "./button"

const meta: Meta<typeof DirectionProvider> = {
  title: "Primitives/DirectionProvider",
  component: DirectionProvider,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DirectionProvider>

export const RightToLeft: Story = {
  render: () => (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="flex gap-2">
        <Button>حفظ</Button>
        <Button variant="outline">إلغاء</Button>
      </div>
    </DirectionProvider>
  ),
}
