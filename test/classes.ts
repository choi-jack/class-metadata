/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Decorator } from '../src/index.js';

function Decorator(): Decorator {
    return (): void => { };
}

@Decorator()
export class Parent {
    @Decorator()
    public static field: string = 'foo';

    @Decorator()
    public static accessorValue: number = 0;

    @Decorator()
    public static get accessor(): number {
        return this.accessorValue;
    }

    public static set accessor(value: number) {
        this.accessorValue = value;
    }

    @Decorator()
    public static method(
        @Decorator()
        parameter: boolean,
    ): [typeof Parent, boolean] {
        return [this, !parameter];
    }

    @Decorator()
    public field: string = 'foo';

    @Decorator()
    public accessorValue: number = 0;

    public constructor(
        @Decorator()
        parameter?: unknown,
    ) { }

    @Decorator()
    public get accessor(): number {
        return this.accessorValue;
    }

    public set accessor(value: number) {
        this.accessorValue = value;
    }

    @Decorator()
    public method(
        @Decorator()
        parameter: boolean = true,
    ): [Parent, boolean] {
        return [this, !parameter];
    }
}

export class Child extends Parent {
    public static field: string = 'foo';

    public static accessorValue: number = 0;

    public static get accessor(): number {
        return this.accessorValue;
    }

    public static set accessor(value: number) {
        this.accessorValue = value;
    }

    public static method(parameter: boolean): [typeof Child, boolean] {
        return [this, !parameter];
    }

    public field: string = 'foo';

    public accessorValue: number = 0;

    public constructor(parameter?: unknown) {
        super(parameter);
    }

    public get accessor(): number {
        return this.accessorValue;
    }

    public set accessor(value: number) {
        this.accessorValue = value;
    }

    public method(parameter: boolean = true): [Child, boolean] {
        return [this, !parameter];
    }
}
