import type { Meta, StoryObj } from "@storybook/react-vite"
import { TrayIcon } from "@phosphor-icons/react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "./empty"
import { Button } from "./button"

const meta: Meta<typeof Empty> = {
  title: "Primitives/Empty",
  component: Empty,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TrayIcon />
        </EmptyMedia>
        <EmptyTitle>Sin participantes todavía</EmptyTitle>
        <EmptyDescription>
          Cuando alguien se inscriba al evento, aparecerá en esta lista.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Invitar participantes</Button>
      </EmptyContent>
    </Empty>
  ),
}
