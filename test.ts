type BonusElementVariant = "declined" | "default";

type ElementVariant = "primary" | "secondary";

type Variant = ElementVariant | BonusElementVariant;

export class MyElement extends HTMLElement {

    foo: Variant;

    bar: ElementVariant = "secondary";

    constructor() {
        super();
        this.foo = "primary";
    }
}

customElements.define("my-element", MyElement);

