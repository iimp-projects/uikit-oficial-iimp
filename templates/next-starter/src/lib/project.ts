import packageJson from "../../package.json"

export const projectStatus = "ready" as const

const fallbackAppVersion = `v${packageJson.version}`
const configuredAppVersion = process.env.NEXT_PUBLIC_APP_VERSION?.trim()

export const appVersion = configuredAppVersion
  ? configuredAppVersion.startsWith("v")
    ? configuredAppVersion
    : `v${configuredAppVersion}`
  : fallbackAppVersion
