// Guardrails para apps consumidoras de official-uikit-iimp.
// Regla: el maquetado se hace con el componente equivalente del kit (basado en shadcn/ui),
// nunca con el elemento HTML nativo ni con estilos propios que dupliquen un componente.

const REPLACEMENTS = {
  button:
    "<Button> (variantes default, secondary, outline, ghost, destructive, link)",
  input:
    "<Input> (o <Checkbox>, <RadioGroup>, <Switch>, <Slider> según el tipo)",
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
  dialog:
    "<Dialog>, <AlertDialog> o los patterns <ConfirmDialog>, <FormDialog>, <InfoDialog>",
  details: "<Accordion> o <Collapsible>",
  summary: "<AccordionTrigger> o <CollapsibleTrigger>",
  kbd: "<Kbd>",
};

const nativeElementRules = Object.entries(REPLACEMENTS).map(([tag, use]) => ({
  selector: `JSXOpeningElement[name.name='${tag}']`,
  message: `No uses <${tag}> nativo. Usa el componente equivalente de official-uikit-iimp: ${use}. Revisa también si existe un pattern que ya resuelva el maquetado.`,
}));

// "border-b" a secas se pinta con el color del texto (negro). Exige algún color en el mismo className
// (token como border-border, o cualquier otro color: border-white/10, border-[#fff], border-red-500...).
const BORDER_HAS_COLOR =
  "(^|\\s)([a-z0-9-]+:)*border(-[xytblrse])?-(?!(0|2|4|8|solid|dashed|dotted|double|none|hidden|collapse|separate|spacing|[xytblrse](-(0|2|4|8))?)(\\s|$))[a-z\\[#]";
const bareBorderRule = {
  selector:
    "JSXAttribute[name.name='className'] Literal[value=/(^|\\s)([a-z0-9-]+:)*border(-[xytblrse])?(-(0|2|4|8))?(\\s|$)/]" +
    `:not([value=/${BORDER_HAS_COLOR}/])`,
  message:
    "Bordes sin color se pintan en negro. Usa <Separator /> para líneas divisorias, o añade `border-border` (ej. `border-b border-border`).",
};

const tableHeadTypographyRule = {
  selector:
    "JSXOpeningElement[name.name='TableHead'] > JSXAttribute[name.name='className'] Literal[value=/(^|\\s)([a-z0-9-]+:)*(text-(xs|sm|base|lg|xl|[0-9]xl|\\[[0-9])|font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\\[))/]",
  message:
    "Las cabeceras de tabla ya traen la tipografía oficial (Manrope 600, 13px, mayúsculas, tracking amplio, color muted). No la sobrescribas en <TableHead>: la regla es del kit.",
};

const officialLayoutImportRules = [
  {
    selector:
      "ImportDeclaration:not([source.value='official-uikit-iimp']) > ImportSpecifier[imported.name=/^(AuthLayout|DashboardLayout|DashboardHeader|DashboardSidebarBrand|DashboardSidebarUser|DashboardNotifications)$/]",
    message:
      'No importes copias locales de los patterns AuthLayout o Dashboard*. Usa el pattern oficial desde "official-uikit-iimp".',
  },
  {
    selector:
      "ImportDeclaration:not([source.value='official-uikit-iimp']) > ImportDefaultSpecifier[local.name=/^(AuthLayout|DashboardLayout|DashboardHeader|DashboardSidebarBrand|DashboardSidebarUser|DashboardNotifications)$/]",
    message:
      'No importes copias locales de los patterns AuthLayout o Dashboard*. Usa el pattern oficial desde "official-uikit-iimp".',
  },
];

// --- Reglas propias de botones (plugin "iimp") ---

const jsxName = (element) =>
  element.type === "JSXElement" &&
  element.openingElement.name.type === "JSXIdentifier"
    ? element.openingElement.name.name
    : undefined;

const findAttr = (element, name) =>
  element.openingElement.attributes.find(
    (a) => a.type === "JSXAttribute" && a.name.name === name,
  );

const hasSpread = (element) =>
  element.openingElement.attributes.some(
    (a) => a.type === "JSXSpreadAttribute",
  );

const attrString = (attr) => {
  if (!attr?.value) return undefined;
  if (attr.value.type === "Literal" && typeof attr.value.value === "string")
    return attr.value.value;
  if (
    attr.value.type === "JSXExpressionContainer" &&
    attr.value.expression.type === "Literal" &&
    typeof attr.value.expression.value === "string"
  )
    return attr.value.expression.value;
  return undefined;
};

// Phosphor (<EyeIcon />) y Remix (<RiCloseLine />) son los sets del kit.
const ICON_NAME = /^(?:[A-Z]\w*Icon|Ri[A-Z]\w*(?:Line|Fill))$/;

const meaningfulChildren = (element) =>
  element.children.filter(
    (child) => !(child.type === "JSXText" && child.value.trim() === ""),
  );

const isIconOnly = (element) => {
  const children = meaningfulChildren(element);
  return (
    children.length > 0 &&
    children.every(
      (child) =>
        child.type === "JSXElement" && ICON_NAME.test(jsxName(child) ?? ""),
    )
  );
};

const iconButtonRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      label:
        "Un <Button> con solo icono necesita nombre accesible: añade aria-label (o aria-labelledby) y, si el significado no es obvio, envuélvelo en <Tooltip>. Si hay espacio, mejor icono + texto.",
      size: 'Un <Button> con solo icono debe usar size="icon" (o icon-sm / icon-lg) para tener el área táctil cuadrada correcta.',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        if (jsxName(node) !== "Button" || hasSpread(node) || !isIconOnly(node))
          return;
        if (!findAttr(node, "aria-label") && !findAttr(node, "aria-labelledby"))
          context.report({ node: node.openingElement, messageId: "label" });
        const size = attrString(findAttr(node, "size"));
        if (
          !findAttr(node, "size") ||
          (size !== undefined && !size.startsWith("icon"))
        )
          context.report({ node: node.openingElement, messageId: "size" });
      },
    };
  },
};

// Contenedores donde botones contiguos con jerarquías distintas son correctos.
const BUTTON_GROUP_EXEMPT_PARENT =
  /^(?:ButtonGroup|[A-Za-z]*Footer|InputGroup\w*|Toggle\w*)$/;

const buttonGroupRule = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      group:
        "Hay {{count}} <Button> seguidos al mismo nivel. Agrúpalos con <ButtonGroup> de official-uikit-iimp (ButtonGroup > Button, con <ButtonGroupSeparator /> si hace falta). Excepciones: footers de dialog/card y combinaciones Primary + otra variante.",
    },
  },
  create(context) {
    const check = (node) => {
      if (BUTTON_GROUP_EXEMPT_PARENT.test(jsxName(node) ?? "")) return;
      let run = [];
      const flush = () => {
        if (run.length >= 2) {
          const variants = run.map(
            (b) =>
              attrString(findAttr(b, "variant")) ??
              (findAttr(b, "variant") ? "dynamic" : "default"),
          );
          const mixesPrimary =
            variants.includes("default") && new Set(variants).size > 1;
          if (!mixesPrimary && !variants.includes("dynamic"))
            context.report({
              node: run[0].openingElement,
              messageId: "group",
              data: { count: String(run.length) },
            });
        }
        run = [];
      };
      for (const child of node.children) {
        if (child.type === "JSXText" && child.value.trim() === "") continue;
        if (
          child.type === "JSXElement" &&
          jsxName(child) === "Button" &&
          !hasSpread(child)
        )
          run.push(child);
        else flush();
      }
      flush();
    };
    return { JSXElement: check, JSXFragment: check };
  },
};

// className literal de un elemento JSX (solo cadenas estáticas; lo dinámico no se analiza).
const staticClassName = (element) => {
  const attr = findAttr(element, "className");
  return attr ? (attrString(attr) ?? "") : "";
};

// Maquetas de varias columnas hechas a mano: grid-cols-N, columns-N o filas flex.
const MANUAL_COLUMNS =
  /(^|\s)(?:[a-z0-9-]+:)*(grid-cols-(?:[2-9]|1[0-2]|\[)|columns-[2-9]|flex-row|flex-wrap)(\s|$)/;
const hasManualFlexRow = (classes) =>
  /(^|\s)(?:[a-z0-9-]+:)*flex(\s|$)/.test(classes) &&
  !/(^|\s)(?:[a-z0-9-]+:)*flex-col(\s|$)/.test(classes);
// Anchos fraccionarios, porcentuales o fijos que dejan huecos al costado del campo.
const FRACTIONAL_WIDTH =
  /(^|\s)(?:[a-z0-9-]+:)*(w-\d+\/\d+|w-\[[^\]]*%\]|basis-[^\s]+|flex-(?:\d|\[)[^\s]*)(\s|$)/;

// Controles que deben llenar su celda dentro de un FormField.
const FIELD_CONTROLS =
  /^(?:Input|Textarea|SelectTrigger|NativeSelect|InputGroup|ComboboxInput|ComboboxTrigger)$/;
const FIXED_CONTROL_WIDTH =
  /(^|\s)(?:[a-z0-9-]+:)*(w-fit|w-auto|w-\d+(?:\.\d+)?|w-\[[^\]]*\]|max-w-[^\s]+)(\s|$)/;
const collectControls = (element, found = []) => {
  for (const child of element.children) {
    if (child.type !== "JSXElement") continue;
    if (FIELD_CONTROLS.test(jsxName(child) ?? "")) found.push(child);
    collectControls(child, found);
  }
  return found;
};

const formGridRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      grid: "Hay {{count}} <FormField> hermanos en un contenedor con columnas manuales. Usa <FormGrid>: calcula las columnas según el ancho real del contenedor (1 en un drawer angosto, varias en una página) y estira los campos sin dejar huecos.",
      control:
        "El control dentro de <FormField> debe llenar su celda: quita {{value}}. El ancho lo decide <FormGrid> (minFieldWidth) o col-span; un ancho fijo deja un hueco al lado.",
      width:
        'No fijes un ancho fraccionario o porcentual ({{value}}) a un campo o a su contenedor: deja un hueco al lado. Colócalo en <FormGrid> y, si necesita su propia fila, usa className="col-span-full".',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        const name = jsxName(node);
        const classes = staticClassName(node);
        const fields = node.children.filter(
          (child) =>
            child.type === "JSXElement" && jsxName(child) === "FormField",
        );

        if (name === "FormField" || fields.length > 0) {
          const bad = FRACTIONAL_WIDTH.exec(classes);
          if (bad)
            context.report({
              node: node.openingElement,
              messageId: "width",
              data: { value: bad[2] },
            });
        }
        if (name === "FormField") {
          for (const control of collectControls(node)) {
            const fixed = FIXED_CONTROL_WIDTH.exec(staticClassName(control));
            if (fixed)
              context.report({
                node: control.openingElement,
                messageId: "control",
                data: { value: fixed[2] },
              });
          }
        }
        if (
          name !== "FormGrid" &&
          fields.length >= 2 &&
          (MANUAL_COLUMNS.test(classes) || hasManualFlexRow(classes))
        )
          context.report({
            node: node.openingElement,
            messageId: "grid",
            data: { count: String(fields.length) },
          });
      },
    };
  },
};

// Controles sueltos (sin FormField) apilados uno bajo otro: típico de un filtro mal armado.
const LOOSE_CONTROLS = /^(?:Input|Select|NativeSelect|Combobox|SearchField)$/;
const LAYOUT_PARENT_EXEMPT =
  /^(?:FilterBar|FormGrid|FormField|Field\w*|ButtonGroup\w*|InputGroup\w*|ToggleGroup\w*|\w+Content|\w+Footer|\w+Header)$/;
const isRowLayout = (classes) =>
  /(^|\s)(?:[a-z0-9-]+:)*(grid-cols-(?:[2-9]|1[0-2]|\[)|flex-row|flex-wrap)(\s|$)/.test(
    classes,
  ) || hasManualFlexRow(classes);

const filterLayoutRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      stacked:
        "Hay {{count}} controles seguidos apilados (cada uno en su propia fila, a veces al 100 % de ancho). Un filtro va en <FilterBar> (una fila que envuelve y respeta el ancho de cada control); un formulario va en <FormField> dentro de <FormGrid>. No los apiles con flex-col ni los estires.",
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        const name = jsxName(node) ?? "";
        if (LAYOUT_PARENT_EXEMPT.test(name) || /^[A-Z]/.test(name)) return;
        const controls = node.children.filter(
          (child) =>
            child.type === "JSXElement" &&
            LOOSE_CONTROLS.test(jsxName(child) ?? ""),
        );
        if (controls.length >= 2 && !isRowLayout(staticClassName(node)))
          context.report({
            node: node.openingElement,
            messageId: "stacked",
            data: { count: String(controls.length) },
          });
      },
    };
  },
};

// Descripciones sueltas: texto de ayuda escrito a mano junto a un campo en vez de usar FormField.
const FIELD_LABELS = /^(?:Label|FieldLabel)$/;
const MUTED_TEXT = /(^|\s)(?:[a-z0-9-]+:)*text-muted-foreground(\s|$)/;
const TEXT_TAGS = /^(?:p|span|small|div|FieldDescription)$/;

const fieldDescriptionRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      loose:
        'Descripción suelta junto a un campo. Pásala como `description="..."` a <FormField>: el kit la muestra en el icono de ayuda (?) junto a la etiqueta, sin agregar una fila ni desalinear los controles del grid.',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        const name = jsxName(node) ?? "";
        if (
          LAYOUT_PARENT_EXEMPT.test(name) &&
          name !== "Field" &&
          name !== "FieldContent"
        )
          return;
        const kids = node.children.filter(
          (child) => child.type === "JSXElement",
        );
        const hasLabel = kids.some((child) =>
          FIELD_LABELS.test(jsxName(child) ?? ""),
        );
        const hasControl = kids.some((child) =>
          LOOSE_CONTROLS.test(jsxName(child) ?? ""),
        );
        if (!hasLabel || !hasControl) return;
        for (const child of kids) {
          const childName = jsxName(child) ?? "";
          const loose =
            childName === "FieldDescription" ||
            (TEXT_TAGS.test(childName) &&
              MUTED_TEXT.test(staticClassName(child)));
          if (loose)
            context.report({ node: child.openingElement, messageId: "loose" });
        }
      },
    };
  },
};

const iimpPlugin = {
  rules: {
    "icon-button-label": iconButtonRule,
    "prefer-button-group": buttonGroupRule,
    "form-grid": formGridRule,
    "filter-layout": filterLayoutRule,
    "field-description": fieldDescriptionRule,
  },
};

const iimpGuardrails = [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: { iimp: iimpPlugin },
    rules: {
      "iimp/icon-button-label": "error",
      "iimp/prefer-button-group": "error",
      "iimp/form-grid": "error",
      "iimp/filter-layout": "error",
      "iimp/field-description": "error",
      "no-restricted-syntax": [
        "error",
        ...nativeElementRules,
        bareBorderRule,
        tableHeadTypographyRule,
        ...officialLayoutImportRules,
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "radix-ui",
              message:
                "No importes Radix directamente; usa los primitives de official-uikit-iimp.",
            },
            {
              name: "@base-ui/react",
              message:
                "No importes Base UI directamente; usa los primitives de official-uikit-iimp.",
            },
            {
              name: "@shadcn/react",
              message:
                "No importes shadcn directamente; usa los componentes de official-uikit-iimp.",
            },
          ],
          patterns: [
            {
              group: ["@radix-ui/*"],
              message:
                "No importes Radix directamente; usa los primitives de official-uikit-iimp.",
            },
            {
              group: [
                "official-uikit-iimp/src",
                "official-uikit-iimp/src/*",
                "official-uikit-iimp/dist",
                "official-uikit-iimp/dist/*",
              ],
              message:
                'Importa solo desde "official-uikit-iimp", no desde rutas internas del paquete.',
            },
          ],
        },
      ],
    },
  },
];

export default iimpGuardrails;
export { iimpGuardrails };
