import * as React from "react"
import type { Preview } from "@storybook/react-vite"
import "../src/styles/globals.css"
import { IimpThemeProvider } from "../src/theme/IimpThemeProvider"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
  },
  globalTypes: {
    themePrimary: {
      description: "Theme Playground — color primary",
      toolbar: {
        title: "Primary",
        icon: "paintbrush",
        items: [
          { value: "#c09153/oklch(0.985 0 0)", title: "IIMP (default)" },
          { value: "#1b4332", title: "Verde" },
          { value: "#7c2d12", title: "Terracota" },
        ],
        dynamicTitle: true,
      },
    },
    themeSecondary: {
      description: "Theme Playground — color secondary",
      toolbar: {
        title: "Secondary",
        icon: "paintbrush",
        items: [
          { value: "#092042/oklch(0.985 0 0)", title: "IIMP (default)" },
          { value: "#e9c46a", title: "Dorado claro" },
          { value: "#94a3b8", title: "Gris azulado" },
        ],
        dynamicTitle: true,
      },
    },
    radius: {
      description: "Theme Playground — radius",
      toolbar: {
        title: "Radius",
        icon: "component",
        items: [
          { value: "0.625rem", title: "IIMP (default, 0.625rem)" },
          { value: "0.25rem", title: "Sharp (0.25rem)" },
          { value: "0.875rem", title: "Preset luma (0.875rem)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    themePrimary: "#c09153/oklch(0.985 0 0)",
    themeSecondary: "#092042/oklch(0.985 0 0)",
    radius: "0.625rem",
  },
  decorators: [
    (Story, context) => (
      <IimpThemeProvider
        theme={{
          primary: String(context.globals.themePrimary).split("/")[0],
          primaryForeground: String(context.globals.themePrimary).split("/")[1],
          secondary: String(context.globals.themeSecondary).split("/")[0],
          secondaryForeground: String(context.globals.themeSecondary).split("/")[1],
          radius: context.globals.radius,
        }}
      >
        <Story />
      </IimpThemeProvider>
    ),
  ],
}

export default preview
