import * as ts from "typescript";

const opts: ts.CompilerOptions = {};
const files = ["./src/test.ts"];


let program = ts.createProgram(files, opts);
let checker = program.getTypeChecker();


const imports: ts.ImportDeclaration[] = [];

const sourceFile = program.getSourceFile("./src/test.ts");
console.log(sourceFile)
sourceFile?.forEachChild(visit);

function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
        imports.push(node);
    }

    node.forEachChild(visit);
}

console.log(imports);
