import type { Meta, StoryObj } from "@storybook/react-vite"
import { UserIcon } from "@phosphor-icons/react"
import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from "./item"
import { Button } from "./button"

const meta: Meta<typeof Item> = {
  title: "Primitives/Item",
  component: Item,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Item>

export const Default: Story = {
  render: () => (
    <ItemGroup className="w-full max-w-md">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <UserIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>María Torres</ItemTitle>
          <ItemDescription>maria.torres@iimp.org.pe</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Ver
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemMedia variant="icon">
          <UserIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Carlos Ruiz</ItemTitle>
          <ItemDescription>carlos.ruiz@iimp.org.pe</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Ver
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
}
