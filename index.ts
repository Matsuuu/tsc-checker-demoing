import ts from "typescript";
import { createDefaultMapFromNodeModules, createSystem, createVirtualCompilerHost, } from "@typescript/vfs";

const compilerOptions = {
    target: ts.ScriptTarget.ESNext,
};
const files = ["./src/test.ts"];


let program = ts.createProgram(files, compilerOptions);
let checker = program.getTypeChecker();
let printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const sourceFile = program.getSourceFile("./src/test.ts");

addExtraCode();

async function addExtraCode() {
    if (!sourceFile) return;

    const className = "MyElement";
    const properties = {
        "foo": "primary",
        "bar": "foo"
    };

    // Create " var _____element = new MyElement()"
    //

    const tempElementName = "______element";
    const elementDeclaration = createElementDeclaration(className, tempElementName);

    const propertyStatements = createPropertyBindings(properties, tempElementName);

    const nodeArray = ts.factory.createNodeArray([
        sourceFile,
        elementDeclaration,
        ...propertyStatements
    ]);

    let tempFileContent = printer.printList(
        ts.ListFormat.MultiLine,
        nodeArray,
        sourceFile
    );

    console.log(tempFileContent)

    const virtualTempFileName = "temp.ts";


    const fsMap = createDefaultMapFromNodeModules(compilerOptions, ts);

    fsMap.set(virtualTempFileName, 'console.log("Foo")')
    //fsMap.set(virtualTempFileName, tempFileContent);

    const system = createSystem(fsMap);
    const host = createVirtualCompilerHost(system, compilerOptions, ts);

    const typeCheckProgram = ts.createProgram({
        rootNames: [...fsMap.keys()],
        options: compilerOptions,
        host: host.compilerHost
    });

    const emitResult = typeCheckProgram.emit();

    console.log("EMIT: ", emitResult)
}

function createElementDeclaration(className: string, tempElementName: string) {
    const variableDeclaration = ts.factory.createVariableDeclaration(
        tempElementName,
        undefined,
        undefined,
        ts.factory.createNewExpression(ts.factory.createIdentifier(className), [], [])
    );
    const variableDeclarationList = ts.factory.createVariableDeclarationList([variableDeclaration]);
    return variableDeclarationList;
}

function createPropertyBindings(properties: Record<string, string>, tempElementName: string) {
    const tempElementIdentifier = ts.factory.createIdentifier(tempElementName);
    // Create propertySetters
    return Object.entries(properties).map(propEntry => {
        const left = ts.factory.createPropertyAccessExpression(tempElementIdentifier, propEntry[0]);

        // TODO: Map this to be dynamic, not just string literal
        const right = ts.factory.createStringLiteral(propEntry[1]);
        const propertyExpression = ts.factory.createBinaryExpression(left, ts.SyntaxKind.EqualsToken, right);
        const expressionStatement = ts.factory.createExpressionStatement(propertyExpression);
        return expressionStatement;
    });
}

