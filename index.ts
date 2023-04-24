import * as ts from "typescript";
import * as fs from "fs";

const opts: ts.CompilerOptions = {};
const files = ["./test.ts"];


let program = ts.createProgram(files, opts);
let checker = program.getTypeChecker();


for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
    }
}


function visit(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
        const fooProp = node.members[0] as ts.PropertyDeclaration;
        const fooType = checker.getTypeAtLocation(fooProp);
        const fooWidened = checker.getWidenedType(fooType)
        console.log(fooWidened)
        // @ts-ignore
        console.log(fooWidened.types.map(type => type.value))

        console.log("=====");

        const barProp = node.members[1] as ts.PropertyDeclaration;
        const barType = checker.getTypeAtLocation(barProp);
        const barWidened = checker.getWidenedType(barType)
        console.log(barProp.type ?? barProp.initializer?.getText())
    }
    if (node.getText() === "foo") {
        // @ts-ignore
        console.log(node.getText());
        console.log("");
        // console.log(checker.)
    }
    node.forEachChild(visit);
}
