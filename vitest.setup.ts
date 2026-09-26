import "@testing-library/jest-dom/vitest"
import { afterEach, expect } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "vitest-axe/matchers"
import type { AxeMatchers } from "vitest-axe/matchers"

expect.extend(matchers)
afterEach(cleanup)

/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
declare module "vitest" {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

// jsdom polyfills for browser APIs used by Radix/Base UI/recharts/embla.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
globalThis.IntersectionObserver ??= IntersectionObserverStub as unknown as typeof IntersectionObserver
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia
Element.prototype.scrollIntoView ??= function () {}
