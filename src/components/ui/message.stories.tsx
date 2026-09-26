import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "./message"
import { Bubble, BubbleContent } from "./bubble"
import { Avatar, AvatarFallback } from "./avatar"

const meta: Meta<typeof Message> = {
  title: "Primitives/Message",
  component: Message,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Message>

export const Default: Story = {
  render: () => (
    <MessageGroup className="max-w-sm">
      <Message align="start">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>María Torres</MessageHeader>
          <Bubble align="start" variant="muted">
            <BubbleContent>¿A qué hora empieza la conferencia?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
}
