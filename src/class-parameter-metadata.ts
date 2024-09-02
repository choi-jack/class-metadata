import { MetadataType } from './metadata-type.js';
import { Metadata } from './metadata.js';
import { Class, PropertyKey } from './types.js';

export class ClassParameterMetadata extends Metadata {
    readonly #map: Map<unknown, unknown>;

    public constructor(
        public readonly declaringClass: Class,
        public readonly target: object,
        public readonly propertyKey: null | PropertyKey,
        public readonly parameterIndex: number,
    ) {
        super();

        this.#map = new Map();
    }

    public has(key: unknown): boolean {
        return this.hasOwn(key);
    }

    public hasOwn(key: unknown): boolean {
        return this.#map.has(key);
    }

    public get<Key>(key: Key): null | MetadataType<Key> {
        return this.getOwn(key);
    }

    public getOwn<Key>(key: Key): null | MetadataType<Key> {
        if (this.hasOwn(key)) {
            return this.#map.get(key)! as MetadataType<Key>;
        }

        return null;
    }

    public set<Key>(key: Key, value: MetadataType<Key>): void {
        this.#map.set(key, value);
    }

    public delete(key: unknown): void {
        this.#map.delete(key);
    }
}
