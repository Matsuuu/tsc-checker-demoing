import ts from "typescript";
import { getDefaultLibFileName } from "typescript";

export class VirtualSystem implements ts.System {
    args: string[] = [];
    newLine: string = "\n";
    useCaseSensitiveFileNames: boolean = true;

    files: Map<string, string> = new Map();

    directoryExists(dirName: string): boolean {
        return [...this.files.keys()].some(path => path.startsWith(dirName));
    }
    fileExists(fileName: string): boolean {
        return this.files.has(fileName);
    }
    getCurrentDirectory(): string {
        return "/";
    }
    getDirectories(): string[] {
        return [];
    }
    readDirectory(path: string): string[] {
        return [...this.files.keys()];
    }
    readFile(fileName: string): string | undefined {
        return this.files.get(fileName);
    }
    resolvePath(path: string): string {
        return path;
    }
    writeFile(fileName: string, data: string): void {
        this.files.set(fileName, data);
    }



    write(s: string): void {
        throw new Error("Not implemented: write");
    }
    getExecutingFilePath(): string {
        throw new Error("Not implemented: getExecutingFilePath");
    }
    exit(exitCode?: number | undefined): void {
        throw new Error("Not implemented: exit");
    }
    createDirectory(path: string): void {
        throw new Error("Not implemented: createDirectory");
    }

}

export interface VirtualCompilerHost extends ts.CompilerHost {
}

export function createVirtualCompilerHost(system: VirtualSystem, compilerOptions: ts.CompilerOptions, ts: typeof import("typescript")): VirtualCompilerHost {

    return new VirtualCompilerHost(system, compilerOptions, ts);
}

export class VirtualCompilerHost implements ts.CompilerHost {

    sourceFiles: Map<string, ts.SourceFile> = new Map();

    constructor(public system: VirtualSystem, private compilerOptions: ts.CompilerOptions, private ts: typeof import("typescript")) {
    }

    getSourceFile(fileName: string): ts.SourceFile | undefined {
        const existing = this.sourceFiles.get(fileName);
        if (existing) {
            return existing;
        }
        return this.saveSourceFile(ts.createSourceFile(fileName, this.system.readFile(fileName)!, this.compilerOptions.target || ts.ScriptTarget.ESNext, false))
    }

    updateFile(sourceFile: ts.SourceFile) {
        const existing = this.sourceFiles.get(sourceFile.fileName);
        this.system.writeFile(sourceFile.fileName, sourceFile.text);
        this.sourceFiles.set(sourceFile.fileName, sourceFile);
        return existing;
    }

    useCaseSensitiveFileNames(): boolean {
        return this.system.useCaseSensitiveFileNames;
    }

    saveSourceFile(sourceFile: ts.SourceFile): ts.SourceFile {
        this.sourceFiles.set(sourceFile.fileName, sourceFile);
        return sourceFile;
    }

    getDirectories(path: string): string[] {
        return this.system.getDirectories();
    }

    getDefaultLibFileName(options: ts.CompilerOptions): string {
        return "/" + ts.getDefaultLibFileName(this.compilerOptions)
    }
    getCanonicalFileName(fileName: string): string {
        return fileName;
    }
    getNewLine(): string {
        return this.system.newLine;
    }
}
