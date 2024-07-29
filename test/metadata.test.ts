import { describe, expect, test } from '@jest/globals';

import { DesignMetadataKeys, Metadata, MetadataKey, MetadataReflector } from '../src/index.js';
import { Child, Parent } from './classes.js';
import { getTarget } from './utils.js';

function designType(metadata: Metadata, type: unknown): void {
    expect(metadata.hasOwn(DesignMetadataKeys.TYPE)).toBe(type !== null);
    expect(metadata.getOwn(DesignMetadataKeys.TYPE)).toBe(type);
}

function designParameterTypes(metadata: Metadata, types: null | ReadonlyArray<unknown>): void {
    expect(metadata.hasOwn(DesignMetadataKeys.PARAMETER_TYPES)).toBe(types !== null);
    expect(metadata.getOwn(DesignMetadataKeys.PARAMETER_TYPES)).toStrictEqual(types);
}

function designReturnType(metadata: Metadata, type: unknown): void {
    expect(metadata.hasOwn(DesignMetadataKeys.RETURN_TYPE)).toBe(type !== null);
    expect(metadata.getOwn(DesignMetadataKeys.RETURN_TYPE)).toBe(type);
}

function classMetadata(parent: Metadata, child: Metadata): void {
    const key: MetadataKey<string> = new MetadataKey();

    expect(parent.has(key)).toBe(false);
    expect(parent.hasOwn(key)).toBe(false);
    expect(parent.get(key)).toBe(null);
    expect(parent.getOwn(key)).toBe(null);

    expect(child.has(key)).toBe(false);
    expect(child.hasOwn(key)).toBe(false);
    expect(child.get(key)).toBe(null);
    expect(child.getOwn(key)).toBe(null);

    parent.set(key, 'foo');

    expect(parent.has(key)).toBe(true);
    expect(parent.hasOwn(key)).toBe(true);
    expect(parent.get(key)).toBe('foo');
    expect(parent.getOwn(key)).toBe('foo');

    expect(child.has(key)).toBe(true);
    expect(child.hasOwn(key)).toBe(false);
    expect(child.get(key)).toBe('foo');
    expect(child.getOwn(key)).toBe(null);

    child.set(key, 'bar');

    expect(parent.has(key)).toBe(true);
    expect(parent.hasOwn(key)).toBe(true);
    expect(parent.get(key)).toBe('foo');
    expect(parent.getOwn(key)).toBe('foo');

    expect(child.has(key)).toBe(true);
    expect(child.hasOwn(key)).toBe(true);
    expect(child.get(key)).toBe('bar');
    expect(child.getOwn(key)).toBe('bar');

    parent.delete(key);

    expect(parent.has(key)).toBe(false);
    expect(parent.hasOwn(key)).toBe(false);
    expect(parent.get(key)).toBe(null);
    expect(parent.getOwn(key)).toBe(null);

    expect(child.has(key)).toBe(true);
    expect(child.hasOwn(key)).toBe(true);
    expect(child.get(key)).toBe('bar');
    expect(child.getOwn(key)).toBe('bar');

    child.delete(key);

    expect(parent.has(key)).toBe(false);
    expect(parent.hasOwn(key)).toBe(false);
    expect(parent.get(key)).toBe(null);
    expect(parent.getOwn(key)).toBe(null);

    expect(child.has(key)).toBe(false);
    expect(child.hasOwn(key)).toBe(false);
    expect(child.get(key)).toBe(null);
    expect(child.getOwn(key)).toBe(null);
}

function classParameterMetadata(parent: Metadata, child: Metadata): void {
    const key: MetadataKey<string> = new MetadataKey();

    expect(parent.has(key)).toBe(false);
    expect(parent.hasOwn(key)).toBe(false);
    expect(parent.get(key)).toBe(null);
    expect(parent.getOwn(key)).toBe(null);

    expect(child.has(key)).toBe(false);
    expect(child.hasOwn(key)).toBe(false);
    expect(child.get(key)).toBe(null);
    expect(child.getOwn(key)).toBe(null);

    parent.set(key, 'foo');

    expect(parent.has(key)).toBe(true);
    expect(parent.hasOwn(key)).toBe(true);
    expect(parent.get(key)).toBe('foo');
    expect(parent.getOwn(key)).toBe('foo');

    expect(child.has(key)).toBe(false);
    expect(child.hasOwn(key)).toBe(false);
    expect(child.get(key)).toBe(null);
    expect(child.getOwn(key)).toBe(null);

    child.set(key, 'bar');

    expect(parent.has(key)).toBe(true);
    expect(parent.hasOwn(key)).toBe(true);
    expect(parent.get(key)).toBe('foo');
    expect(parent.getOwn(key)).toBe('foo');

    expect(child.has(key)).toBe(true);
    expect(child.hasOwn(key)).toBe(true);
    expect(child.get(key)).toBe('bar');
    expect(child.getOwn(key)).toBe('bar');

    parent.delete(key);

    expect(parent.has(key)).toBe(false);
    expect(parent.hasOwn(key)).toBe(false);
    expect(parent.get(key)).toBe(null);
    expect(parent.getOwn(key)).toBe(null);

    expect(child.has(key)).toBe(true);
    expect(child.hasOwn(key)).toBe(true);
    expect(child.get(key)).toBe('bar');
    expect(child.getOwn(key)).toBe('bar');

    child.delete(key);

    expect(parent.has(key)).toBe(false);
    expect(parent.hasOwn(key)).toBe(false);
    expect(parent.get(key)).toBe(null);
    expect(parent.getOwn(key)).toBe(null);

    expect(child.has(key)).toBe(false);
    expect(child.hasOwn(key)).toBe(false);
    expect(child.get(key)).toBe(null);
    expect(child.getOwn(key)).toBe(null);
}

function field(isStatic: boolean): void {
    const parent: Metadata = MetadataReflector.reflect(getTarget(Parent, isStatic), 'field');
    const child: Metadata = MetadataReflector.reflect(getTarget(Child, isStatic), 'field');

    classMetadata(parent, child);

    designType(parent, String);
    designType(child, null);
}

function accessor(isStatic: boolean): void {
    const parent: Metadata = MetadataReflector.reflect(getTarget(Parent, isStatic), 'accessor');
    const child: Metadata = MetadataReflector.reflect(getTarget(Child, isStatic), 'accessor');

    classMetadata(parent, child);

    designType(parent, Number);
    designType(child, null);
}

function method(isStatic: boolean): void {
    const parent: Metadata = MetadataReflector.reflect(getTarget(Parent, isStatic), 'method');
    const child: Metadata = MetadataReflector.reflect(getTarget(Child, isStatic), 'method');

    classMetadata(parent, child);

    designType(parent, Function);
    designType(child, null);

    designParameterTypes(parent, [Boolean]);
    designParameterTypes(child, null);

    designReturnType(parent, Array);
    designReturnType(child, null);
}

function methodParameter(isStatic: boolean): void {
    const parent: Metadata = MetadataReflector.reflect(getTarget(Parent, isStatic), 'method', 0);
    const child: Metadata = MetadataReflector.reflect(getTarget(Child, isStatic), 'method', 0);

    classParameterMetadata(parent, child);

    designType(parent, Boolean);
    designType(child, null);
}

describe('metadata', (): void => {
    test('key', (): void => {
        expect.hasAssertions();

        const empty: MetadataKey = new MetadataKey();

        expect(empty.description).toBe('');
        expect(empty.toString()).toBe('MetadataKey()');

        const nonEmpty: MetadataKey = new MetadataKey('non-empty');

        expect(nonEmpty.description).toBe('non-empty');
        expect(nonEmpty.toString()).toBe('MetadataKey(non-empty)');
    });

    test('class', (): void => {
        expect.hasAssertions();

        const parent: Metadata = MetadataReflector.reflect(Parent);
        const child: Metadata = MetadataReflector.reflect(Child);

        classMetadata(parent, child);

        designParameterTypes(parent, [Object]);
        designParameterTypes(child, null);
    });

    test('constructor-parameter', (): void => {
        expect.hasAssertions();

        const parent: Metadata = MetadataReflector.reflect(Parent, null, 0);
        const child: Metadata = MetadataReflector.reflect(Child, null, 0);

        classParameterMetadata(parent, child);

        designType(parent, Object);
        designType(child, null);
    });

    describe('static', (): void => {
        test('field', (): void => {
            expect.hasAssertions();

            field(true);
        });

        test('accessor', (): void => {
            expect.hasAssertions();

            accessor(true);
        });

        test('method', (): void => {
            expect.hasAssertions();

            method(true);
        });

        test('method-parameter', (): void => {
            expect.hasAssertions();

            methodParameter(true);
        });
    });

    describe('instance', (): void => {
        test('field', (): void => {
            expect.hasAssertions();

            field(false);
        });

        test('accessor', (): void => {
            expect.hasAssertions();

            accessor(false);
        });

        test('method', (): void => {
            expect.hasAssertions();

            method(false);
        });

        test('method-parameter', (): void => {
            expect.hasAssertions();

            methodParameter(false);
        });
    });
});
