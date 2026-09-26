import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileTextIcon, XIcon } from "@phosphor-icons/react"
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "./attachment"

const meta: Meta<typeof Attachment> = {
  title: "Primitives/Attachment",
  component: Attachment,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Attachment>

export const Default: Story = {
  render: () => (
    <Attachment className="max-w-xs">
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>programa_evento.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Quitar archivo">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}

export const Error: Story = {
  render: () => (
    <Attachment className="max-w-xs" state="error">
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>programa_evento.pdf</AttachmentTitle>
        <AttachmentDescription>Error al subir el archivo</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Quitar archivo">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}
