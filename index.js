"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const compiler_host_1 = require("./src/typescript-tools/compiler-host");
const compilerOptions = {
    target: typescript_1.default.ScriptTarget.ESNext,
    lib: ["es2021"]
};
const files = ["./src/test.ts"];
let program = typescript_1.default.createProgram(files, compilerOptions);
let checker = program.getTypeChecker();
let printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
const sourceFile = program.getSourceFile("./src/test.ts");
addExtraCode();
function addExtraCode() {
    return __awaiter(this, void 0, void 0, function* () {
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
        //const fsMap = createDefaultMapFromNodeModules(compilerOptions, ts);
        const system = new compiler_host_1.VirtualSystem();
        const host = (0, compiler_host_1.createVirtualCompilerHost)(system, compilerOptions, typescript_1.default);
        system.writeFile(virtualTempFileName, 'console.log("foo")');
        //fsMap.set(virtualTempFileName, 'console.log("Foo")')
        //fsMap.set(virtualTempFileName, tempFileContent);
        // const system = createSystem(fsMap);
        // const host = createVirtualCompilerHost(system, compilerOptions, ts);
        const typeCheckProgram = typescript_1.default.createProgram({
            rootNames: [...system.files.keys()],
            options: compilerOptions,
            host
        });
        const emitResult = typeCheckProgram.emit();
        console.log("EMIT: ", emitResult);
    });
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
function loadTypescriptLibFile(filename) {
    const libDir = path_1.default.dirname(require.resolve("typescript"));
    return fs_1.default.readFileSync(path_1.default.resolve(libDir, filename), "utf-8");
}
