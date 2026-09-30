import { describe, expect, it } from "vitest"
import { appVersion, projectStatus } from "./project"

describe("starter", () => {
  it("inicia en estado listo", () => {
    expect(projectStatus).toBe("ready")
  })

  it("expone una versión pública con prefijo v", () => {
    expect(appVersion).toBe("v0.0.1")
  })
})
