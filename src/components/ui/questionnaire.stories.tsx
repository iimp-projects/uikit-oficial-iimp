import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Questionnaire,
  QuestionnaireProgress,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireDescription,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireActions,
  QuestionnaireNext,
  QuestionnaireSubmit,
} from "./questionnaire"

const meta: Meta<typeof Questionnaire> = {
  title: "Primitives/Questionnaire",
  component: Questionnaire,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Questionnaire>

export const Default: Story = {
  render: () => (
    <Questionnaire className="max-w-sm" defaultItem="asistencia">
      <QuestionnaireProgress />
      <QuestionnaireItem name="asistencia" required>
        <QuestionnaireTitle>¿Asistirás al evento?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Necesitamos confirmar tu asistencia para reservar tu cupo.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="si">Sí, asistiré</QuestionnaireChoice>
          <QuestionnaireChoice value="no">No podré asistir</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  ),
}
