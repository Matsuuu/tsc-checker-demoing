import ts, { CompilerOptions } from "typescript";
import fs from "fs";
import { createDefaultMapFromNodeModules, createSystem, createVirtualCompilerHost, } from "@typescript/vfs";
import path from "path";

const compilerOptions: CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
}
const fsMap = createDefaultMapFromNodeModules(compilerOptions, ts);
applyHotfix(fsMap);
fsMap.set("test.ts", 'console.log("Foo")')

const system = createSystem(fsMap);
const host = createVirtualCompilerHost(system, compilerOptions, ts);

const typeCheckProgram = ts.createProgram({
    rootNames: [...fsMap.keys()],
    options: compilerOptions,
    host: host.compilerHost
});

console.log(typeCheckProgram.getSourceFile("test.ts"));

function applyHotfix(fsMap: Map<string, string>) {

    let hotfixFiles = [
        "lib.es5.d.ts",
        "lib.decorators.d.ts",
        "lib.decorators.legacy.d.ts",
        "lib.dom.d.ts",
        "lib.webworker.importscripts.d.ts",
        "lib.scripthost.d.ts"
    ];

    function loadTypescriptLibFile(filename: string) {
        const libDir = path.dirname(require.resolve("typescript"));
        return fs.readFileSync(path.resolve(libDir, filename), "utf-8");
    }

    hotfixFiles.forEach(f => {
        fsMap.set("/" + f, loadTypescriptLibFile(f));
    });

}