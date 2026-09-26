import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel"

const meta: Meta<typeof Carousel> = {
  title: "Primitives/Carousel",
  component: Carousel,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Carousel>

const slides = ["Ponencias", "Talleres", "Networking", "Exposición comercial"]

export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex h-40 items-center justify-center rounded-lg bg-muted text-lg font-medium">
              {slide}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}
