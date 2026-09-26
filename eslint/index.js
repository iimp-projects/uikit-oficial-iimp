// Guardrails para apps consumidoras de official-uikit-iimp.
// Regla: el maquetado se hace con el componente equivalente del kit (basado en shadcn/ui),
// nunca con el elemento HTML nativo ni con estilos propios que dupliquen un componente.

const REPLACEMENTS = {
  button: "<Button> (variantes default, secondary, outline, ghost, destructive, link)",
  input: "<Input> (o <Checkbox>, <RadioGroup>, <Switch>, <Slider> según el tipo)",
  select: "<Select> o <NativeSelect>",
  textarea: "<Textarea>",
  label: "<Label> o <FormField>",
  table: "<Table> o el pattern <DataTable>",
  thead: "<TableHeader> (dentro de <Table>)",
  tbody: "<TableBody> (dentro de <Table>)",
  tfoot: "<TableFooter> (dentro de <Table>)",
  tr: "<TableRow> (dentro de <Table>)",
  th: "<TableHead> (dentro de <Table>)",
  td: "<TableCell> (dentro de <Table>)",
  hr: "<Separator>",
  progress: "<Progress>",
  dialog: "<Dialog>, <AlertDialog> o los patterns <ConfirmDialog>, <FormDialog>, <InfoDialog>",
  details: "<Accordion> o <Collapsible>",
  summary: "<AccordionTrigger> o <CollapsibleTrigger>",
  kbd: "<Kbd>",
}

const nativeElementRules = Object.entries(REPLACEMENTS).map(([tag, use]) => ({
  selector: `JSXOpeningElement[name.name='${tag}']`,
  message: `No uses <${tag}> nativo. Usa el componente equivalente de official-uikit-iimp: ${use}. Revisa también si existe un pattern que ya resuelva el maquetado.`,
}))

// "border-b" a secas se pinta con el color del texto (negro). Exige un color de token.
const BORDER_COLOR_TOKEN =
  "(^|\\s)border(-[xytblrse])?-(border|input|ring|primary|secondary|destructive|muted|accent|transparent|foreground|success|warning|info|card|sidebar-border|current)"
const bareBorderRule = {
  selector:
    "JSXAttribute[name.name='className'] Literal[value=/(^|\\s)border(-[xytblrse])?(\\s|$)/]" +
    `:not([value=/${BORDER_COLOR_TOKEN}/])`,
  message:
    "Bordes sin color se pintan en negro. Usa <Separator /> para líneas divisorias, o añade `border-border` (ej. `border-b border-border`).",
}

const iimpGuardrails = [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...nativeElementRules, bareBorderRule],
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
            {
              name: "@shadcn/react",
              message: "No importes shadcn directamente; usa los componentes de official-uikit-iimp.",
            },
          ],
          patterns: [
            {
              group: ["@radix-ui/*"],
              message: "No importes Radix directamente; usa los primitives de official-uikit-iimp.",
            },
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
