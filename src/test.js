"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyElement = void 0;
const foo_1 = require("./subfolder/foo");
class MyElement extends HTMLElement {
    constructor() {
        super();
        this.bar = "secondary";
        this.foo = "primary";
        const aa = (0, foo_1.doSomething)();
    }
}
exports.MyElement = MyElement;
customElements.define("my-element", MyElement);
