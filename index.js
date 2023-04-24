"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
const opts = {};
const files = ["./test.ts"];
let program = ts.createProgram(files, opts);
let checker = program.getTypeChecker();
for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
    }
}
function visit(node) {
    var _a, _b;
    if (ts.isClassDeclaration(node)) {
        const fooProp = node.members[0];
        const fooType = checker.getTypeAtLocation(fooProp);
        const fooWidened = checker.getWidenedType(fooType);
        console.log(fooWidened);
        // @ts-ignore
        console.log(fooWidened.types.map(type => type.value));
        console.log("=====");
        const barProp = node.members[1];
        const barType = checker.getTypeAtLocation(barProp);
        const barWidened = checker.getWidenedType(barType);
        console.log((_a = barProp.type) !== null && _a !== void 0 ? _a : (_b = barProp.initializer) === null || _b === void 0 ? void 0 : _b.getText());
    }
    if (node.getText() === "foo") {
        // @ts-ignore
        console.log(node.getText());
        console.log("");
        // console.log(checker.)
    }
    node.forEachChild(visit);
}
