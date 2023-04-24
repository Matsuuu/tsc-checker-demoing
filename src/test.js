"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyElement = void 0;
class MyElement extends HTMLElement {
    constructor() {
        super();
        this.bar = "secondary";
        this.foo = "primary";
    }
}
exports.MyElement = MyElement;
customElements.define("my-element", MyElement);
