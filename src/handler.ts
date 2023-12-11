export interface Handler {
    readonly target: object;
    readonly propertyKey: null | PropertyKey;
    readonly parameterIndex: null | number;

    has(key: unknown): boolean;
    get<T>(key: unknown): null | T;
    set(key: unknown, value: unknown): void;
    delete(key: unknown): void;
}
