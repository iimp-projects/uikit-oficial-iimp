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
    primary: {
      description: "Theme Playground — color primary",
      toolbar: {
        title: "Primary",
        icon: "paintbrush",
        items: [
          { value: "#092042", title: "IIMP (default)" },
          { value: "#1b4332", title: "Verde" },
          { value: "#7c2d12", title: "Terracota" },
        ],
        dynamicTitle: true,
      },
    },
    secondary: {
      description: "Theme Playground — color secondary",
      toolbar: {
        title: "Secondary",
        icon: "paintbrush",
        items: [
          { value: "#f2e8dd/#c09153", title: "IIMP (default)" },
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
          { value: "0.625rem", title: "Default (0.625rem)" },
          { value: "0.25rem", title: "Sharp (0.25rem)" },
          { value: "1rem", title: "Round (1rem)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    primary: "#092042",
    secondary: "#f2e8dd/#c09153",
    radius: "0.625rem",
  },
  decorators: [
    (Story, context) => (
      <IimpThemeProvider
        theme={{
          primary: context.globals.primary,
          secondary: String(context.globals.secondary).split("/")[0],
          secondaryForeground: String(context.globals.secondary).split("/")[1],
          radius: context.globals.radius,
        }}
      >
        <Story />
      </IimpThemeProvider>
    ),
  ],
}

export default preview
