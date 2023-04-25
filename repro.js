"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const vfs_1 = require("@typescript/vfs");
const path_1 = __importDefault(require("path"));
const compilerOptions = {
    target: typescript_1.default.ScriptTarget.ESNext,
};
const fsMap = (0, vfs_1.createDefaultMapFromNodeModules)(compilerOptions, typescript_1.default);
applyHotfix(fsMap);
fsMap.set("test.ts", 'console.log("Foo")');
const system = (0, vfs_1.createSystem)(fsMap);
const host = (0, vfs_1.createVirtualCompilerHost)(system, compilerOptions, typescript_1.default);
const typeCheckProgram = typescript_1.default.createProgram({
    rootNames: [...fsMap.keys()],
    options: compilerOptions,
    host: host.compilerHost
});
console.log(typeCheckProgram.getSourceFile("test.ts"));
function applyHotfix(fsMap) {
    let hotfixFiles = [
        "lib.es5.d.ts",
        "lib.decorators.d.ts",
        "lib.decorators.legacy.d.ts",
        "lib.dom.d.ts",
        "lib.webworker.importscripts.d.ts",
        "lib.scripthost.d.ts"
    ];
    function loadTypescriptLibFile(filename) {
        const libDir = path_1.default.dirname(require.resolve("typescript"));
        return fs_1.default.readFileSync(path_1.default.resolve(libDir, filename), "utf-8");
    }
    hotfixFiles.forEach(f => {
        fsMap.set("/" + f, loadTypescriptLibFile(f));
    });
}
