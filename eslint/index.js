const NATIVE_CONTROL_MESSAGE =
  "Usa el componente equivalente de official-uikit-iimp en vez del elemento nativo."

const iimpGuardrails = [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='button']",
          message: NATIVE_CONTROL_MESSAGE,
        },
        {
          selector: "JSXOpeningElement[name.name='input']",
          message: NATIVE_CONTROL_MESSAGE,
        },
        {
          selector: "JSXOpeningElement[name.name='select']",
          message: NATIVE_CONTROL_MESSAGE,
        },
        {
          selector: "JSXOpeningElement[name.name='textarea']",
          message: NATIVE_CONTROL_MESSAGE,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "radix-ui",
              message: "No importes Radix directamente; usa los primitives de official-uikit-iimp.",
            },
            {
              name: "@base-ui/react",
              message: "No importes Base UI directamente; usa los primitives de official-uikit-iimp.",
            },
          ],
          patterns: [
            {
              group: ["official-uikit-iimp/src", "official-uikit-iimp/src/*", "official-uikit-iimp/dist", "official-uikit-iimp/dist/*"],
              message: 'Importa solo desde "official-uikit-iimp", no desde rutas internas del paquete.',
            },
          ],
        },
      ],
    },
  },
]

export default iimpGuardrails
export { iimpGuardrails }
