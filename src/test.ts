import { ElementVariant, Variant } from "./interfaces";

export class MyElement extends HTMLElement {

    foo: Variant;

    bar: ElementVariant = "secondary";

    constructor() {
        super();
        this.foo = "primary";
    }
}

customElements.define("my-element", MyElement);

