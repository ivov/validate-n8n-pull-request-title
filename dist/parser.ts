import { readFileSync } from "fs";
import glob from "fast-glob";
import ts from "typescript";

async function getDisplayNames() {
  const files = await glob("packages/nodes-base/nodes/**/*.node.ts");

  return files.reduce<string[]>((acc, cur) => {
    const displayName = getDisplayName(cur);

    // main file for versioned node has no `description`
    // e.g. packages/nodes-base/nodes/BambooHr/BambooHr.node.ts
    if (displayName) acc.push(displayName);

    return acc;
  }, []);
}

function getDisplayName(fileName: string) {
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015
  );

  const classDeclaration = sourceFile.statements.find(
    (s) => s.kind === ts.SyntaxKind.ClassDeclaration
  ) as ts.ClassDeclaration;

  const descriptionPropertyDeclaration = classDeclaration.members
    .filter(
      (m): m is ts.PropertyDeclaration =>
        m.kind === ts.SyntaxKind.PropertyDeclaration
    )
    .find(
      (m) =>
        m.name?.kind === ts.SyntaxKind.Identifier &&
        m.name.escapedText === "description" &&
        m.initializer?.kind === ts.SyntaxKind.ObjectLiteralExpression
    ) as ts.PropertyDeclaration & {
    initializer: ts.SyntaxKind.ObjectLiteralExpression & {
      properties: ts.PropertyAssignment[];
    };
  };

  if (!descriptionPropertyDeclaration) return;

  const propertyAssignment =
    descriptionPropertyDeclaration.initializer.properties.find(
      (p) =>
        p.kind === ts.SyntaxKind.PropertyAssignment &&
        p.name.kind === ts.SyntaxKind.Identifier &&
        p.name.escapedText === "displayName" &&
        p.initializer.kind === ts.SyntaxKind.StringLiteral
    ) as ts.PropertyAssignment & { initializer: { text: string } };

  return propertyAssignment.initializer.text;
}

getDisplayNames();
