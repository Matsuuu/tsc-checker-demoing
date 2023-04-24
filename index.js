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
const fs = __importStar(require("fs"));
const opts = {};
const files = ["./src/test.ts"];
let program = ts.createProgram(files, opts);
let checker = program.getTypeChecker();
let printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const imports = [];
const sourceFile = program.getSourceFile("./src/test.ts");
sourceFile === null || sourceFile === void 0 ? void 0 : sourceFile.forEachChild(visit);
function visit(node) {
    if (ts.isImportDeclaration(node)) {
        imports.push(node);
    }
    node.forEachChild(visit);
}
// console.log(imports);
addExtraCode();
function addExtraCode() {
    if (!sourceFile)
        return;
    const className = "MyElement";
    const properties = {
        "foo": "primary",
        "bar": "secondary"
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
    let temp = printer.printList(ts.ListFormat.MultiLine, nodeArray, sourceFile);
    console.log(temp);
    fs.writeFileSync("./temp.ts", temp, "utf-8");
}
function createElementDeclaration(className, tempElementName) {
    const variableDeclaration = ts.factory.createVariableDeclaration(tempElementName, undefined, undefined, ts.factory.createNewExpression(ts.factory.createIdentifier(className), [], []));
    const variableDeclarationList = ts.factory.createVariableDeclarationList([variableDeclaration]);
    return variableDeclarationList;
}
function createPropertyBindings(properties, tempElementName) {
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
