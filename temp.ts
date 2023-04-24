import { doSomething } from "./foo";
import { ElementVariant, Variant } from "./interfaces";
export class MyElement extends HTMLElement {
    foo: Variant;
    bar: ElementVariant = "secondary";
    constructor() {
        super();
        this.foo = "primary";
        const aa = doSomething();
    }
}
customElements.define("my-element", MyElement);
element
