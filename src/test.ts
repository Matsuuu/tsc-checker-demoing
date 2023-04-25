import { ElementVariant, Variant } from "./interfaces";
import { doSomething } from "./subfolder/foo";

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

