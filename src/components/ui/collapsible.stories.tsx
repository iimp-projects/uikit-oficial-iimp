import type { Meta, StoryObj } from "@storybook/react-vite"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
import { Button } from "./button"

const meta: Meta<typeof Collapsible> = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Ver detalles del evento</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
        Fecha, sede y agenda completa del evento se muestran aquí.
      </CollapsibleContent>
    </Collapsible>
  ),
}
