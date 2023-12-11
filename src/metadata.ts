import { ClassMetadataHandler } from './class-metadata-handler.js';
import { ClassParameterMetadataHandler } from './class-parameter-metadata-handler.js';
import { Handler } from './handler.js';

const enum MetadataKeys {
    DESIGN_PARAMTYPES = 'design:paramtypes',
    DESIGN_TYPE = 'design:type',

    CLASS_METADATA_METADATA = 'class-metadata:metadata',
    CLASS_METADATA_METADATA_PARAMETERS = 'class-metadata:metadata.parameters',
}

export class Metadata implements Handler {
    private static getParent(target: object): null | object {
        const parent: null | object = Reflect.getPrototypeOf(target);

        switch (parent) {
            case Function.prototype:
            case Object.prototype:
                return null;
        }

        return parent;
    }

    private static createParameterMetadata(methodMetadata: Metadata, parameterIndex: number): Metadata {
        const parent: null | object = this.getParent(methodMetadata.target);
        const parentParameterMetadata: null | Metadata = parent === null
            ? null
            : this.getParameterMetadata(parent, methodMetadata.propertyKey, parameterIndex);

        const parameterMetadataHandler: ClassParameterMetadataHandler = new ClassParameterMetadataHandler(methodMetadata.target, methodMetadata.propertyKey, parameterIndex);
        const parameterMetadata: Metadata = new Metadata(parameterMetadataHandler, parentParameterMetadata);

        const parameterTypes: ReadonlyArray<unknown> = methodMetadata.getOwn(MetadataKeys.DESIGN_PARAMTYPES) ?? [];

        if (parameterTypes.length > parameterIndex) {
            parameterMetadata.set(MetadataKeys.DESIGN_TYPE, parameterTypes[parameterIndex]);
        }

        return parameterMetadata;
    }

    private static getParameterMetadata(target: object, propertyKey: undefined | null | PropertyKey, parameterIndex: number): Metadata {
        const methodMetadata: Metadata = this.of(target, propertyKey);

        const parameterMetadataArray: Array<undefined | Metadata> = methodMetadata.getOwn(MetadataKeys.CLASS_METADATA_METADATA_PARAMETERS) ?? [];
        const parameterMetadata: Metadata = parameterMetadataArray[parameterIndex] ?? this.createParameterMetadata(methodMetadata, parameterIndex);

        parameterMetadataArray[parameterIndex] = parameterMetadata;
        methodMetadata.set(MetadataKeys.CLASS_METADATA_METADATA_PARAMETERS, parameterMetadataArray);

        return parameterMetadata;
    }

    private static getMethodMetadata(metadata: Metadata): null | Metadata {
        if (metadata.hasOwn(MetadataKeys.DESIGN_PARAMTYPES)) {
            return metadata;
        }

        if (metadata.parent === null) {
            return null;
        }

        return this.getMethodMetadata(metadata.parent);
    }

    public static of(target: object, propertyKey?: null | PropertyKey, parameterIndex?: null | number): Metadata {
        if (parameterIndex === undefined || parameterIndex === null) {
            const metadataHandler: ClassMetadataHandler = new ClassMetadataHandler(target, propertyKey ?? null);

            if (metadataHandler.has(MetadataKeys.CLASS_METADATA_METADATA)) {
                return metadataHandler.get(MetadataKeys.CLASS_METADATA_METADATA)!;
            }

            const parent: null | object = this.getParent(target);
            const parentMetadata: null | Metadata = parent === null
                ? null
                : this.of(parent, propertyKey);

            return metadataHandler.get(MetadataKeys.CLASS_METADATA_METADATA) ?? new Metadata(metadataHandler, parentMetadata);
        }

        return this.getParameterMetadata(target, propertyKey, parameterIndex);
    }

    public static parametersOf(target: object, propertyKey?: null | PropertyKey): ReadonlyArray<Metadata> {
        const metadata: Metadata = Metadata.of(target, propertyKey);
        const methodMetadata: null | Metadata = this.getMethodMetadata(metadata);

        if (methodMetadata === null) {
            return [];
        }

        const parameterTypes: ReadonlyArray<unknown> = methodMetadata.getOwn(MetadataKeys.DESIGN_PARAMTYPES)!;

        return parameterTypes.map((_parameterType: unknown, index: number): Metadata => {
            return this.of(methodMetadata.target, methodMetadata.propertyKey, index);
        });
    }

    public static decorator(callback: (metadata: Metadata) => void): ClassDecorator & PropertyDecorator & MethodDecorator & ParameterDecorator {
        return (target: object, propertyKey?: PropertyKey, descriptorOrParameterIndex?: PropertyDescriptor | number): void => {
            const parameterIndex: null | number = typeof descriptorOrParameterIndex === 'number'
                ? descriptorOrParameterIndex
                : null;
            const metadata: Metadata = this.of(target, propertyKey, parameterIndex);

            callback(metadata);
        };
    }

    public readonly target: Object;
    public readonly propertyKey: null | PropertyKey;
    public readonly parameterIndex: null | number;

    private readonly decoratorArguments: [object, undefined | PropertyKey, undefined | PropertyDescriptor | number];

    private constructor(
        private readonly handler: Handler,

        public readonly parent: null | Metadata,
    ) {
        this.target = this.handler.target;
        this.propertyKey = this.handler.propertyKey;
        this.parameterIndex = this.handler.parameterIndex;

        this.decoratorArguments = this.parameterIndex === null
            ? [
                this.target,
                this.propertyKey ?? undefined,
                this.propertyKey === null
                    ? undefined
                    : Reflect.getOwnPropertyDescriptor(this.target, this.propertyKey),
            ]
            : [
                this.target,
                this.propertyKey ?? undefined,
                this.parameterIndex,
            ];

        this.set(MetadataKeys.CLASS_METADATA_METADATA, this);
    }

    public has(key: unknown): boolean {
        if (this.handler.has(key)) {
            return true;
        }

        if (this.parent === null) {
            return false;
        }

        return this.parent.has(key);
    }

    public hasOwn(key: unknown): boolean {
        return this.handler.has(key);
    }

    public get<T>(key: unknown): null | T {
        if (this.handler.has(key)) {
            return this.handler.get(key);
        }

        if (this.parent === null) {
            return null;
        }

        return this.parent.get(key);
    }

    public getOwn<T>(key: unknown): null | T {
        return this.handler.get(key);
    }

    public set(key: unknown, value: unknown): void {
        this.handler.set(key, value);
    }

    public delete(key: unknown): void {
        this.handler.delete(key);
    }

    public decorate(decorators: ReadonlyArray<ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator>): void;
    public decorate(decorators: ReadonlyArray<(target: object, propertyKey?: PropertyKey, descriptorOrParameterIndex?: PropertyDescriptor | number) => void>): void {
        for (const decorator of decorators) {
            decorator(...this.decoratorArguments);
        }
    }
}
