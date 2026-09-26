import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "./message-scroller"

const meta: Meta<typeof MessageScroller> = {
  title: "Primitives/MessageScroller",
  component: MessageScroller,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof MessageScroller>

export const Default: Story = {
  render: () => (
    <MessageScrollerProvider>
      <MessageScroller className="h-64 max-w-sm rounded-lg border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-4">
            {Array.from({ length: 12 }, (_, index) => (
              <MessageScrollerItem key={index}>
                Mensaje número {index + 1}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  ),
}
