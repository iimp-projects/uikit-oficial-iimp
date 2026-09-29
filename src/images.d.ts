// Ambient module declarations for static image imports used by Storybook demo stories
// (e.g. src/components/patterns/AuthLayout.stories.tsx). None of these are referenced from
// src/index.ts, so they never affect the published package — this file only satisfies `tsc`
// for the Storybook-only story sources.
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
