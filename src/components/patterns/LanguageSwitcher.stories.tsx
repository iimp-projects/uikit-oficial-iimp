import type { Meta, StoryObj } from "@storybook/react-vite"
import { LanguageSwitcher } from "./LanguageSwitcher"

const meta: Meta<typeof LanguageSwitcher> = {
  title: "Patterns/LanguageSwitcher",
  component: LanguageSwitcher,
  tags: ["autodocs"],
  args: {
    languages: ["es", "en", "qu"],
  },
}
export default meta

type Story = StoryObj<typeof LanguageSwitcher>

export const Default: Story = {}

export const CustomLabels: Story = {
  args: {
    languages: [
      { code: "es", label: "ES", ariaLabel: "Español" },
      { code: "en", label: "EN", ariaLabel: "English" },
      { code: "qu", label: "QU", ariaLabel: "Quechua" },
    ],
  },
}

export const LegacyGoogleBridge: Story = {
  args: {
    languages: ["es", "en", "qu"],
    googleTranslate: { sourceLanguage: "es", loadScript: false, reload: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demuestra el bridge de cookie sin recargar Storybook. En una app, el valor por defecto de reload es true.",
      },
    },
  },
}
