const PARSER_CONTENT = `
import { readFileSync } from 'fs';
import glob from 'fast-glob';
import ts from 'typescript';

async function getDisplayNames() {
	const files = await Promise.all([
		glob('packages/nodes-base/nodes/**/*.node.ts'),
		glob('packages/nodes-base/nodes/**/versionDescription.ts'),
	]);

	const names = files.flat().reduce<string[]>((acc, cur) => {
		const displayName = getDisplayName(cur);

		// main file for versioned node has no description
		// e.g. packages/nodes-base/nodes/BambooHr/BambooHr.node.ts
		if (displayName) acc.push(displayName);

		return acc;
	}, []);

	return [...new Set(names)];
}

function getDisplayName(filename: string) {
	const sourceFile = ts.createSourceFile(
		filename,
		readFileSync(filename).toString(),
		ts.ScriptTarget.ES2015,
	);

	/**
	 * Unversioned node: description.displayName in *.node.ts
	 */

	const classDeclaration = sourceFile.statements.find(
		(s) => s.kind === ts.SyntaxKind.ClassDeclaration,
	) as ts.ClassDeclaration;

	let descriptionPropertyDeclaration = classDeclaration?.members
		.filter((m): m is ts.PropertyDeclaration => m.kind === ts.SyntaxKind.PropertyDeclaration)
		.find(
			(m) =>
				m.name?.kind === ts.SyntaxKind.Identifier &&
				'description' === m.name.escapedText &&
				m.initializer?.kind === ts.SyntaxKind.ObjectLiteralExpression,
		) as ts.PropertyDeclaration & {
		initializer: ts.SyntaxKind.ObjectLiteralExpression & { properties: ts.PropertyAssignment[] };
	};

	/**
	 * Versioned node: versionDescription.ts
	 * e.g. BambooHr
	 */
	if (!descriptionPropertyDeclaration && filename.endsWith('versionDescription.ts')) {
		const variableStatement = sourceFile.statements.find(
			(s) => s.kind === ts.SyntaxKind.VariableStatement,
		) as ts.VariableStatement;

		const declaration = variableStatement.declarationList.declarations.find(
			(d) =>
				d.name.kind === ts.SyntaxKind.Identifier && d.name.escapedText === 'versionDescription',
		) as
			| {
					initializer: ts.SyntaxKind.ObjectLiteralExpression & {
						properties: ts.PropertyAssignment[];
					};
			  }
			| undefined;

		const property = declaration?.initializer?.properties?.find(
			(p) =>
				p.name.kind === ts.SyntaxKind.Identifier &&
				p.name.escapedText === 'displayName' &&
				p.initializer.kind === ts.SyntaxKind.StringLiteral,
		) as { initializer: ts.ObjectLiteralExpression & { text: string } } | undefined;

		if (property?.initializer?.text) return property?.initializer?.text;
	}

	/**
	 * Versioned node: baseDescription.displayName in *.node.ts
	 * e.g. Notion
	 */
	if (!descriptionPropertyDeclaration) {
		const constructor = classDeclaration?.members.find(
			(m) => m.kind === ts.SyntaxKind.Constructor,
		) as
			| (ts.SyntaxKind.Constructor & {
					body: {
						statements: Array<
							ts.VariableStatement & {
								declarationList: { declarations: ts.VariableDeclaration[] };
							}
						>;
					};
			  })
			| undefined;

		if (!constructor) return;

		const varStatement = constructor?.body?.statements[0];

		if (!varStatement) return;

		// @ts-ignore
		descriptionPropertyDeclaration = varStatement.declarationList?.declarations[0];
	}

	if (!descriptionPropertyDeclaration) return;

	return extractDisplayNameFromInitializer(descriptionPropertyDeclaration.initializer);
}

function extractDisplayNameFromInitializer(
	initializer: ts.SyntaxKind.ObjectLiteralExpression & { properties: ts.PropertyAssignment[] },
) {
	const propertyAssignment = initializer.properties.find(
		(p) =>
			p.kind === ts.SyntaxKind.PropertyAssignment &&
			p.name.kind === ts.SyntaxKind.Identifier &&
			p.name.escapedText === 'displayName' &&
			p.initializer.kind === ts.SyntaxKind.StringLiteral,
	) as ts.PropertyAssignment & { initializer: { text: string } };

	return propertyAssignment.initializer.text;
}

getDisplayNames().then((result) => console.log(JSON.stringify(result)));
`.replace(/'/g, '\\"');

module.exports = { PARSER_CONTENT };
