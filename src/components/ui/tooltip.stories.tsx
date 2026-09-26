import type { Meta, StoryObj } from "@storybook/react-vite"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip"
import { Button } from "./button"

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Pasa el mouse aquí</Button>
        </TooltipTrigger>
        <TooltipContent>Acción rápida: duplicar evento</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
