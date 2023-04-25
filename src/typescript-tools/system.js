"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualSystem = exports.initializeVirtualFileSystemMap = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function initializeVirtualFileSystemMap() {
    function loadTypescriptLibFile(filename) {
        const libDir = path_1.default.dirname(require.resolve("typescript"));
        return fs_1.default.readFileSync(path_1.default.resolve(libDir, filename), "utf-8");
    }
    const fsMap = new Map();
    const libDirectory = path_1.default.dirname(require.resolve("typescript"));
    const libFiles = fs_1.default.readdirSync(libDirectory);
    libFiles
        .filter(libFile => libFile.startsWith("lib") && libFile.endsWith(".d.ts"))
        .forEach(libFile => {
        fsMap.set("/" + libFile, loadTypescriptLibFile(libFile));
    });
    return fsMap;
}
exports.initializeVirtualFileSystemMap = initializeVirtualFileSystemMap;
class VirtualSystem {
    constructor() {
        this.args = [];
        this.newLine = "\n";
        this.useCaseSensitiveFileNames = true;
        this.files = new Map();
        this.files = initializeVirtualFileSystemMap();
    }
    directoryExists(dirName) {
        return [...this.files.keys()].some(path => path.startsWith(dirName));
    }
    fileExists(fileName) {
        return this.files.has(fileName);
    }
    getCurrentDirectory() {
        return "/";
    }
    getDirectories() {
        return [];
    }
    readDirectory(path) {
        return [...this.files.keys()];
    }
    readFile(fileName) {
        return this.files.get(fileName);
    }
    resolvePath(path) {
        return path;
    }
    writeFile(fileName, data) {
        this.files.set(fileName, data);
    }
    write(s) {
        throw new Error("Not implemented: write");
    }
    getExecutingFilePath() {
        throw new Error("Not implemented: getExecutingFilePath");
    }
    exit(exitCode) {
        throw new Error("Not implemented: exit");
    }
    createDirectory(path) {
        throw new Error("Not implemented: createDirectory");
    }
}
exports.VirtualSystem = VirtualSystem;
