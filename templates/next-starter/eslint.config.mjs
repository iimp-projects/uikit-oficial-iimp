import iimpNextStrict from "official-uikit-iimp/eslint/next-strict"

const config = [
  { ignores: [".agents/**", ".claude/**", ".iimp/**"] },
  ...iimpNextStrict,
]

export default config
