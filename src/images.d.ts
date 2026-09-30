// Ambient module declarations for static image imports used by source components and Storybook
// demos. Assets referenced from src/index.ts are emitted by tsup into dist and ship with npm.
declare module "*.png" {
  const src: string
  export default src
}
declare module "*.jpg" {
  const src: string
  export default src
}
declare module "*.svg" {
  const src: string
  export default src
}
