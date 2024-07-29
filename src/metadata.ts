import { MetadataType } from './metadata-type.js';
import { Class } from './types.js';

export abstract class Metadata {
    public abstract readonly declaringClass: Class;
    public abstract readonly target: object;
    public abstract readonly propertyKey: null | PropertyKey;
    public abstract readonly parameterIndex: null | number;

    public abstract has(key: unknown): boolean;
    public abstract hasOwn(key: unknown): boolean;

    public abstract get<Key>(key: Key): null | MetadataType<Key>;
    public abstract getOwn<Key>(key: Key): null | MetadataType<Key>;

    public abstract set<Key>(key: Key, value: MetadataType<Key>): void;

    public abstract delete(key: unknown): void;
}
