import ts from "typescript";
import fs from "fs";
import path from "path";
import { createVirtualCompilerHost } from "./src/typescript-tools/compiler-host";
import { VirtualSystem } from "./src/typescript-tools/system";

const compilerOptions: ts.CompilerOptions = {
    ...ts.getDefaultCompilerOptions(),
    target: ts.ScriptTarget.ESNext,
    lib: ["es2021"],
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    module: ts.ModuleKind.ESNext,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    esModuleInterop: true,
    strict: true
};
const files = ["./src/test.ts"];


let program = ts.createProgram(files, compilerOptions);
let checker = program.getTypeChecker();
let printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

addExtraCode();

function readSourceFile(fileName: string) {
    return fs.readFileSync("./src/" + fileName, "utf8");
}

async function addExtraCode() {
    const sourceFile = program.getSourceFile("./src/test.ts");

    if (!sourceFile) {
        return;
    }

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

    const virtualTempFileName = "/temp.ts";


    //const fsMap = createDefaultMapFromNodeModules(compilerOptions, ts);
    const system = new VirtualSystem();
    const host = createVirtualCompilerHost(system, compilerOptions, ts);

    system.writeFile(virtualTempFileName, tempFileContent);
    system.writeFile("boo.ts", `
        const foo = "bar";
        foo = "biz";`);
    system.writeFile("/interfaces.ts", readSourceFile("interfaces.ts"));
    system.writeFile("/foo.ts", readSourceFile("foo.ts"));

    const typeCheckProgram = ts.createProgram({
        rootNames: [...system.files.keys()],
        options: compilerOptions,
        host
    });

    const diag = typeCheckProgram.getSemanticDiagnostics(host.getSourceFile(virtualTempFileName));

    console.log("DIAG: ", diag)
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


function loadTypescriptLibFile(filename: string) {
    const libDir = path.dirname(require.resolve("typescript"));
    return fs.readFileSync(path.resolve(libDir, filename), "utf-8");
}
