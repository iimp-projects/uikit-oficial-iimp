import { appVersion } from "@/lib/project"

/** Identidad de la aplicación: lo único que cambias para el login y la marca del sidebar. */
export const APP = {
  name: "Mi sistema",
  tagline: "Instituto de Ingenieros de Minas del Perú",
  version: appVersion.replace(/^v/, ""),
} as const
