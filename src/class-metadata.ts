import { MetadataType } from './metadata-type.js';
import { Metadata } from './metadata.js';
import { Class } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
    function hasMetadata(key: unknown, target: object, propertyKey?: PropertyKey): boolean;
    function hasOwnMetadata(key: unknown, target: object, propertyKey?: PropertyKey): boolean;

    function getMetadata(key: unknown, target: object, propertyKey?: PropertyKey): unknown;
    function getOwnMetadata(key: unknown, target: object, propertyKey?: PropertyKey): unknown;

    function defineMetadata(key: unknown, value: unknown, target: object, propertyKey?: PropertyKey): void;

    function deleteMetadata(key: unknown, target: object, propertyKey?: PropertyKey): void;
}

export class ClassMetadata extends Metadata {
    readonly #propertyKey: undefined | PropertyKey;

    public readonly parameterIndex: null;

    public constructor(
        public readonly declaringClass: Class,
        public readonly target: object,
        public readonly propertyKey: null | PropertyKey,
    ) {
        super();

        this.#propertyKey = this.propertyKey ?? undefined;
        this.parameterIndex = null;
    }

    public has(key: unknown): boolean {
        return Reflect.hasMetadata(key, this.target, this.#propertyKey);
    }

    public hasOwn(key: unknown): boolean {
        return Reflect.hasOwnMetadata(key, this.target, this.#propertyKey);
    }

    public get<Key>(key: Key): null | MetadataType<Key> {
        if (this.has(key)) {
            return Reflect.getMetadata(key, this.target, this.#propertyKey) as MetadataType<Key>;
        }

        return null;
    }

    public getOwn<Key>(key: Key): null | MetadataType<Key> {
        if (this.hasOwn(key)) {
            return Reflect.getOwnMetadata(key, this.target, this.#propertyKey) as MetadataType<Key>;
        }

        return null;
    }

    public set<Key>(key: Key, value: MetadataType<Key>): void {
        Reflect.defineMetadata(key, value, this.target, this.#propertyKey);
    }

    public delete(key: unknown): void {
        Reflect.deleteMetadata(key, this.target, this.#propertyKey);
    }
}
