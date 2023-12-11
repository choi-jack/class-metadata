import { Handler } from './handler.js';

export class ClassParameterMetadataHandler implements Handler {
    private readonly metadata: Map<unknown, unknown>;

    public constructor(
        public readonly target: object,
        public readonly propertyKey: null | PropertyKey,
        public readonly parameterIndex: number,
    ) {
        this.metadata = new Map();
    }

    public has(key: unknown): boolean {
        return this.metadata.has(key)
    }

    public get<T>(key: unknown): T | null {
        if (this.metadata.has(key)) {
            return this.metadata.get(key) as T;
        }

        return null;
    }

    public set(key: unknown, value: unknown): void {
        this.metadata.set(key, value);
    }

    public delete(key: unknown): void {
        this.metadata.delete(key);
    }
}
