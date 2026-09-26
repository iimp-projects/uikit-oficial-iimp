import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu"

const meta: Meta<typeof NavigationMenu> = {
  title: "Primitives/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Eventos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#">Conferencias</NavigationMenuLink>
            <NavigationMenuLink href="#">Talleres</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Ponentes</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Contacto</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
