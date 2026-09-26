import type { Meta, StoryObj } from "@storybook/react-vite"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card"
import { Button } from "./button"

const meta: Meta<typeof HoverCard> = {
  title: "Primitives/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@iimp-eventos</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">IIMP Eventos</p>
          <p className="text-sm text-muted-foreground">
            Organizador oficial de PERUMIN y ProEXPLO.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
