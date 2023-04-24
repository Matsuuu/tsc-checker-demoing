"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const vfs_1 = require("@typescript/vfs");
const opts = {};
const files = ["./src/test.ts"];
let program = typescript_1.default.createProgram(files, opts);
let checker = program.getTypeChecker();
let printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
const sourceFile = program.getSourceFile("./src/test.ts");
addExtraCode();
function addExtraCode() {
    if (!sourceFile)
        return;
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
    const nodeArray = typescript_1.default.factory.createNodeArray([
        sourceFile,
        elementDeclaration,
        ...propertyStatements
    ]);
    let tempFileContent = printer.printList(typescript_1.default.ListFormat.MultiLine, nodeArray, sourceFile);
    console.log(tempFileContent);
    const virtualTempFileName = "temp.ts";
    const fsMap = new Map();
    //fsMap.set(virtualTempFileName, tempFileContent);
    fsMap.set(virtualTempFileName, "console.log('foo');");
    const system = (0, vfs_1.createSystem)(fsMap);
    const host = (0, vfs_1.createVirtualCompilerHost)(system, {}, typescript_1.default);
    const typeCheckProgram = typescript_1.default.createProgram({
        rootNames: [...fsMap.keys()],
        options: {},
        host: host.compilerHost
    });
    const emitResult = typeCheckProgram.emit(typeCheckProgram.getSourceFile(virtualTempFileName));
    console.log("EMIT: ", emitResult);
}
function createElementDeclaration(className, tempElementName) {
    const variableDeclaration = typescript_1.default.factory.createVariableDeclaration(tempElementName, undefined, undefined, typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier(className), [], []));
    const variableDeclarationList = typescript_1.default.factory.createVariableDeclarationList([variableDeclaration]);
    return variableDeclarationList;
}
function createPropertyBindings(properties, tempElementName) {
    const tempElementIdentifier = typescript_1.default.factory.createIdentifier(tempElementName);
    // Create propertySetters
    return Object.entries(properties).map(propEntry => {
        const left = typescript_1.default.factory.createPropertyAccessExpression(tempElementIdentifier, propEntry[0]);
        // TODO: Map this to be dynamic, not just string literal
        const right = typescript_1.default.factory.createStringLiteral(propEntry[1]);
        const propertyExpression = typescript_1.default.factory.createBinaryExpression(left, typescript_1.default.SyntaxKind.EqualsToken, right);
        const expressionStatement = typescript_1.default.factory.createExpressionStatement(propertyExpression);
        return expressionStatement;
    });
}
