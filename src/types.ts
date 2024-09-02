export interface Class<Instance extends object = object> {
    new(...args: ReadonlyArray<any>): Instance;

    readonly prototype: Instance;
}

export type PropertyKey = string | symbol;

export type Decorator = ClassDecorator & PropertyDecorator & MethodDecorator & ParameterDecorator;
