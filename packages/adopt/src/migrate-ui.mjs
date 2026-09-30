import { existsSync } from "node:fs";
import { join } from "node:path";
import { Project, QuoteKind, SyntaxKind } from "ts-morph";

const SAFE_COMPONENTS = {
  button: "Button",
  input: "Input",
  label: "Label",
  textarea: "Textarea",
  hr: "Separator",
};

const UNSAFE_INPUT_TYPES = new Set(["checkbox", "radio", "range", "hidden"]);

function hasConflictingName(sourceFile, component) {
  const declaration = new RegExp(
    `\\b(?:const|let|var|function|class)\\s+${component}\\b`,
  );
  if (declaration.test(sourceFile.getFullText())) return true;
  return sourceFile.getImportDeclarations().some((importDeclaration) => {
    if (importDeclaration.getModuleSpecifierValue() === "official-uikit-iimp")
      return false;
    if (importDeclaration.getDefaultImport()?.getText() === component)
      return true;
    return importDeclaration
      .getNamedImports()
      .some(
        (namedImport) =>
          namedImport.getAliasNode()?.getText() === component ||
          namedImport.getName() === component,
      );
  });
}

function isSafeInput(element) {
  const type = element.getAttribute("type");
  if (!type || type.getKind() !== SyntaxKind.JsxAttribute) return true;
  const initializer = type.getInitializer();
  if (!initializer) return true;
  const value = initializer.getText().replaceAll(/["']/g, "").toLowerCase();
  return !UNSAFE_INPUT_TYPES.has(value);
}

function ensureImports(sourceFile, components) {
  if (!components.size) return;
  let importDeclaration = sourceFile.getImportDeclaration(
    "official-uikit-iimp",
  );
  if (!importDeclaration) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "official-uikit-iimp",
      namedImports: [...components].sort(),
    });
    return;
  }
  const current = new Set(
    importDeclaration
      .getNamedImports()
      .map((namedImport) => namedImport.getName()),
  );
  for (const component of [...components].sort()) {
    if (!current.has(component)) importDeclaration.addNamedImport(component);
  }
}

export function migrateSafeNativeControls(cwd) {
  const project = new Project({
    compilerOptions: { allowJs: true, jsx: 4 },
    manipulationSettings: { quoteKind: QuoteKind.Double },
    skipAddingFilesFromTsConfig: true,
  });
  const roots = ["src", "app", "pages", "components"].filter((directory) =>
    existsSync(join(cwd, directory)),
  );
  for (const root of roots)
    project.addSourceFilesAtPaths(join(cwd, root, "**/*.{tsx,jsx}"));

  const changes = [];
  for (const sourceFile of project.getSourceFiles()) {
    const imports = new Set();
    let replacements = 0;
    const elements = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ];

    for (const element of elements) {
      const tag = element.getTagNameNode().getText();
      const component = SAFE_COMPONENTS[tag];
      if (!component || hasConflictingName(sourceFile, component)) continue;
      if (tag === "input" && !isSafeInput(element)) continue;
      element.getTagNameNode().replaceWithText(component);
      if (element.getKind() === SyntaxKind.JsxOpeningElement) {
        element
          .getParentIfKind(SyntaxKind.JsxElement)
          ?.getClosingElement()
          .getTagNameNode()
          .replaceWithText(component);
      }
      imports.add(component);
      replacements += 1;
    }

    if (replacements) {
      ensureImports(sourceFile, imports);
      sourceFile.saveSync();
      changes.push({
        file: sourceFile.getFilePath(),
        replacements,
        components: [...imports].sort(),
      });
    }
  }
  return changes;
}
