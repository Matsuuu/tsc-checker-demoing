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

    const tempSourceFile = ts.createSourceFile("temp.ts", "", ts.ScriptTarget.ESNext);

    const variableDeclaration = ts.factory.createVariableDeclaration("element");

    const nodeArray = ts.factory.createNodeArray([
        sourceFile,
        variableDeclaration
    ]);

    let temp = printer.printList(
        ts.ListFormat.MultiLine,
        nodeArray,
        sourceFile
    );

    console.log(sourceFile.getFullText())
    fs.writeFileSync("./temp.ts", temp, "utf-8");
}

