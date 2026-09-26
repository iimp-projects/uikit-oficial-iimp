import type { Meta, StoryObj } from "@storybook/react-vite"
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "./native-select"

const meta: Meta<typeof NativeSelect> = {
  title: "Primitives/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof NativeSelect>

export const Default: Story = {
  render: () => (
    <NativeSelect aria-label="Ciudad" defaultValue="pe" className="w-56">
      <NativeSelectOptGroup label="Perú">
        <NativeSelectOption value="pe">Lima</NativeSelectOption>
        <NativeSelectOption value="pe-are">Arequipa</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Otros">
        <NativeSelectOption value="cl">Santiago</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}

export const Small: Story = {
  render: () => (
    <NativeSelect aria-label="Ciudad" size="sm" defaultValue="pe" className="w-56">
      <NativeSelectOption value="pe">Lima</NativeSelectOption>
      <NativeSelectOption value="cl">Santiago</NativeSelectOption>
    </NativeSelect>
  ),
}
