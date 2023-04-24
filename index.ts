import * as ts from "typescript";
import * as fs from "fs";

const opts: ts.CompilerOptions = {};
const files = ["./test.ts"];


let program = ts.createProgram(files, opts);
let checker = program.getTypeChecker();


const sourceFile = program.getSourceFile("./src/test.ts");

const importNodes = "";
