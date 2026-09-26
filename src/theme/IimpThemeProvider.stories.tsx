import type { Meta, StoryObj } from "@storybook/react-vite"
import { IimpThemeProvider } from "./IimpThemeProvider"
import { Button } from "../components/ui/button"

const meta: Meta<typeof IimpThemeProvider> = {
  title: "Theme/IimpThemeProvider",
  component: IimpThemeProvider,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof IimpThemeProvider>

export const DosMarcas: Story = {
  render: () => (
    <div className="flex gap-8">
      <IimpThemeProvider theme={{ primary: "#092042", secondary: "#c09153" }}>
        <div className="flex flex-col items-start gap-2 rounded-lg border border-border p-4">
          <span className="text-sm text-muted-foreground">IIMP (default)</span>
          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </div>
      </IimpThemeProvider>
      <IimpThemeProvider theme={{ primary: "#1b4332", secondary: "#e9c46a" }}>
        <div className="flex flex-col items-start gap-2 rounded-lg border border-border p-4">
          <span className="text-sm text-muted-foreground">Vertical de ejemplo</span>
          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </div>
      </IimpThemeProvider>
    </div>
  ),
}
