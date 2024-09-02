import { ClassMetadata } from './class-metadata.js';
import { ClassParameterMetadata } from './class-parameter-metadata.js';
import { DesignMetadataKeys } from './design-metadata-keys.js';
import { MetadataKey } from './metadata-key.js';
import { Metadata } from './metadata.js';
import { Class, Decorator, PropertyKey } from './types.js';

const CLASS_METADATA: MetadataKey<ClassMetadata> = new MetadataKey('class-metadata');
const CLASS_PARAMETER_METADATA_MAP: MetadataKey<Map<number, ClassParameterMetadata>> = new MetadataKey('class-parameter-metadata-map');

function getClass(target: object): Class {
    if (typeof target === 'function') {
        return target as Class;
    }

    return target.constructor as Class;
}

function getClassMetadata(target: object, propertyKey: null | PropertyKey): ClassMetadata {
    const classMetadata: ClassMetadata = new ClassMetadata(getClass(target), target, propertyKey);

    if (classMetadata.hasOwn(CLASS_METADATA)) {
        return classMetadata.getOwn(CLASS_METADATA)!;
    }

    classMetadata.set(CLASS_METADATA, classMetadata);

    return classMetadata;
}

function getClassParameterMetadataMap(classMetadata: ClassMetadata): Map<number, ClassParameterMetadata> {
    if (classMetadata.hasOwn(CLASS_PARAMETER_METADATA_MAP)) {
        return classMetadata.getOwn(CLASS_PARAMETER_METADATA_MAP)!;
    }

    const classParameterMetadataMap: Map<number, ClassParameterMetadata> = new Map();

    classMetadata.set(CLASS_PARAMETER_METADATA_MAP, classParameterMetadataMap);

    return classParameterMetadataMap;
}

function getClassParameterMetadata(classMetadata: ClassMetadata, parameterIndex: number): ClassParameterMetadata {
    const classParameterMetadataMap: Map<number, ClassParameterMetadata> = getClassParameterMetadataMap(classMetadata);

    if (classParameterMetadataMap.has(parameterIndex)) {
        return classParameterMetadataMap.get(parameterIndex)!;
    }

    const classParameterMetadata: ClassParameterMetadata = new ClassParameterMetadata(classMetadata.declaringClass, classMetadata.target, classMetadata.propertyKey, parameterIndex);

    classParameterMetadataMap.set(classParameterMetadata.parameterIndex, classParameterMetadata);

    const parameterTypes: null | ReadonlyArray<unknown> = classMetadata.getOwn(DesignMetadataKeys.PARAMETER_TYPES) as null | ReadonlyArray<unknown>;

    if (parameterTypes !== null && parameterTypes.length > classParameterMetadata.parameterIndex) {
        classParameterMetadata.set(DesignMetadataKeys.TYPE, parameterTypes[classParameterMetadata.parameterIndex]);
    }

    return classParameterMetadata;
}

export function reflect(target: object, propertyKey?: null | PropertyKey, parameterIndex?: null | number): Metadata {
    const classMetadata: ClassMetadata = getClassMetadata(target, propertyKey ?? null);

    if (parameterIndex === undefined || parameterIndex === null) {
        return classMetadata;
    }

    return getClassParameterMetadata(classMetadata, parameterIndex);
}

export function createDecorator(callback: (metadata: Metadata) => void): Decorator {
    return (target: object, propertyKey?: PropertyKey, descriptorOrParameterIndex?: PropertyDescriptor | number): void => {
        const parameterIndex: null | number = typeof descriptorOrParameterIndex === 'number'
            ? descriptorOrParameterIndex
            : null;
        const metadata: Metadata = reflect(target, propertyKey, parameterIndex);

        callback(metadata);
    };
}
