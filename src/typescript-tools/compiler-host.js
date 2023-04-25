"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualCompilerHost = exports.createVirtualCompilerHost = void 0;
const typescript_1 = __importDefault(require("typescript"));
function createVirtualCompilerHost(system, compilerOptions, ts) {
    return new VirtualCompilerHost(system, compilerOptions, ts);
}
exports.createVirtualCompilerHost = createVirtualCompilerHost;
class VirtualCompilerHost {
    constructor(system, compilerOptions, ts) {
        this.system = system;
        this.compilerOptions = compilerOptions;
        this.ts = ts;
        this.sourceFiles = new Map();
    }
    writeFile(fileName, text) {
        return this.system.writeFile(fileName, text);
    }
    getCurrentDirectory() {
        return this.system.getCurrentDirectory();
    }
    fileExists(fileName) {
        return this.system.fileExists(fileName);
    }
    readFile(fileName) {
        return this.system.readFile(fileName);
    }
    getSourceFile(fileName) {
        const existing = this.sourceFiles.get(fileName);
        if (existing) {
            return existing;
        }
        return this.saveSourceFile(typescript_1.default.createSourceFile(fileName, this.system.readFile(fileName), this.compilerOptions.target || typescript_1.default.ScriptTarget.ESNext, false));
    }
    updateFile(sourceFile) {
        const existing = this.sourceFiles.get(sourceFile.fileName);
        this.system.writeFile(sourceFile.fileName, sourceFile.text);
        this.sourceFiles.set(sourceFile.fileName, sourceFile);
        return existing;
    }
    useCaseSensitiveFileNames() {
        return this.system.useCaseSensitiveFileNames;
    }
    saveSourceFile(sourceFile) {
        this.sourceFiles.set(sourceFile.fileName, sourceFile);
        return sourceFile;
    }
    getDirectories(path) {
        return this.system.getDirectories();
    }
    getDefaultLibFileName(options) {
        return "/" + typescript_1.default.getDefaultLibFileName(this.compilerOptions);
    }
    getCanonicalFileName(fileName) {
        return fileName;
    }
    getNewLine() {
        return this.system.newLine;
    }
}
exports.VirtualCompilerHost = VirtualCompilerHost;
