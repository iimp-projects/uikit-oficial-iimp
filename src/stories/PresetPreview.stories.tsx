import type { Meta, StoryObj } from "@storybook/react-vite"
import { TooltipProvider } from "../components/ui/tooltip"
import Preview from "./preset-preview/preview"
import Preview02 from "./preset-preview/preview-02"

// Reproduction of the shadcn create page preview (preset b1aIuQ2XC, radix + luma) with the kit components
// and IIMP colors. Use it to compare the kit against ui.shadcn.com/create?preset=b1aIuQ2XC.
const meta: Meta = {
  title: "Foundations/Preset Preview",
  parameters: { layout: "fullscreen", a11y: { disable: true } },
}
export default meta

export const Preview01: StoryObj = { name: "Preview", render: () => (
    <TooltipProvider>
      <Preview />
    </TooltipProvider>
  ) }
export const Preview02Story: StoryObj = { name: "Preview 02", render: () => (
    <TooltipProvider>
      <Preview02 />
    </TooltipProvider>
  ) }
