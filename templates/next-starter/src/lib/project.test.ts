import { describe, expect, it } from "vitest"
import { projectStatus } from "./project"

describe("starter", () => {
  it("inicia en estado listo", () => {
    expect(projectStatus).toBe("ready")
  })
})
