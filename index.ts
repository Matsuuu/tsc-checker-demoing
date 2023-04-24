import * as ts from "typescript";
import * as fs from "fs";

const opts: ts.CompilerOptions = {};
const files = ["./src/test.ts"];


let program = ts.createProgram(files, opts);
let checker = program.getTypeChecker();
let printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });


const imports: ts.ImportDeclaration[] = [];

const sourceFile = program.getSourceFile("./src/test.ts");
sourceFile?.forEachChild(visit);

function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
        imports.push(node);
    }

    node.forEachChild(visit);
}

// console.log(imports);

addExtraCode();

function addExtraCode() {
    if (!sourceFile) return;

    const className = "MyElement";
    const properties = {
        "foo": "primary",
        "bar": "secondary"
    };

    const tempElementName = "______element";
    // Create " var _____element = new MyElement()"
    const variableDeclaration = ts.factory.createVariableDeclaration(
        tempElementName,
        undefined,
        undefined,
        ts.factory.createNewExpression(ts.factory.createIdentifier(className), [], [])
    );
    const variableDeclarationList = ts.factory.createVariableDeclarationList([variableDeclaration]);
    //

    const tempElementIdentifier = ts.factory.createIdentifier(tempElementName);

    // Create propertySetters
    const propertyStatementNodes = Object.entries(properties).map(propEntry => {
        const left = ts.factory.createPropertyAccessExpression(tempElementIdentifier, propEntry[0]);

        const right = ts.factory.createStringLiteral(propEntry[1]);
        const propertyExpression = ts.factory.createBinaryExpression(left, ts.SyntaxKind.EqualsToken, right);
        const expressionStatement = ts.factory.createExpressionStatement(propertyExpression);
        return expressionStatement;
    });

    const nodeArray = ts.factory.createNodeArray([
        sourceFile,
        variableDeclarationList,
        ...propertyStatementNodes
    ]);

    let temp = printer.printList(
        ts.ListFormat.MultiLine,
        nodeArray,
        sourceFile
    );

    console.log(temp)
    fs.writeFileSync("./temp.ts", temp, "utf-8");
}

