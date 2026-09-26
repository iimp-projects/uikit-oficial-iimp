import type { Meta, StoryObj } from "@storybook/react-vite"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion"

const meta: Meta<typeof Accordion> = {
  title: "Primitives/Accordion",
  component: Accordion,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>¿Cómo me inscribo al evento?</AccordionTrigger>
        <AccordionContent>
          Regístrate desde el portal de inscripciones con tu correo institucional.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>¿Hay certificado de participación?</AccordionTrigger>
        <AccordionContent>
          Sí, se entrega un certificado digital al finalizar el evento.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>¿Puedo cambiar de sede?</AccordionTrigger>
        <AccordionContent>
          Sí, escribe a soporte antes de la fecha límite de inscripción.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
