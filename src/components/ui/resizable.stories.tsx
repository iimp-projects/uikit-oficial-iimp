import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable"

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "Primitives/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ResizablePanelGroup>

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="h-48 max-w-md rounded-lg border">
      <ResizablePanel defaultSize="50">
        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
          Panel izquierdo
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50">
        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
          Panel derecho
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
