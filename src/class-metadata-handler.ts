/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Handler } from './handler.js';

export class ClassMetadataHandler implements Handler {
    public readonly parameterIndex: null;

    public constructor(
        public readonly target: object,
        public readonly propertyKey: null | PropertyKey,
    ) {
        this.parameterIndex = null;
    }

    public has(key: unknown): boolean {
        if (this.propertyKey === null) {
            return Reflect.hasOwnMetadata(key, this.target);
        }
        else {
            return Reflect.hasOwnMetadata(key, this.target, this.propertyKey as any);
        }
    }

    public get<T>(key: unknown): T | null {
        if (this.has(key)) {
            if (this.propertyKey === null) {
                return Reflect.getOwnMetadata(key, this.target);
            }
            else {
                return Reflect.getOwnMetadata(key, this.target, this.propertyKey as any);
            }
        }

        return null;
    }

    public set(key: unknown, value: unknown): void {
        if (this.propertyKey === null) {
            Reflect.defineMetadata(key, value, this.target);
        }
        else {
            Reflect.defineMetadata(key, value, this.target, this.propertyKey as any);
        }
    }

    public delete(key: unknown): void {
        if (this.propertyKey === null) {
            Reflect.deleteMetadata(key, this.target);
        }
        else {
            Reflect.deleteMetadata(key, this.target, this.propertyKey as any);
        }
    }
}
