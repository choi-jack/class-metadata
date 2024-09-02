import { describe, expect, test } from '@jest/globals';

import { Class, Metadata, MetadataReflector, PropertyKey } from '../src/index.js';
import { Parent } from './classes.js';
import { getTarget } from './utils.js';

function getClass(target: object): Class {
    if (typeof target === 'function') {
        return target as Class;
    }

    return target.constructor as Class;
}

function owner(metadata: Metadata, target: object, propertyKey: null | PropertyKey, parameterIndex: null | number): void {
    expect(metadata.declaringClass).toBe(getClass(target));
    expect(metadata.target).toBe(target);
    expect(metadata.propertyKey).toBe(propertyKey);
    expect(metadata.parameterIndex).toBe(parameterIndex);
}

function cache(metadata: Metadata): void {
    expect(metadata).toBe(MetadataReflector.reflect(metadata.target, metadata.propertyKey, metadata.parameterIndex));
}

function field(isStatic: boolean): void {
    const target: object = getTarget(Parent, isStatic);
    const metadata: Metadata = MetadataReflector.reflect(target, 'field');

    owner(metadata, target, 'field', null);
    cache(metadata);
}

function accessor(isStatic: boolean): void {
    const target: object = getTarget(Parent, isStatic);
    const metadata: Metadata = MetadataReflector.reflect(target, 'accessor');

    owner(metadata, target, 'accessor', null);
    cache(metadata);
}

function method(isStatic: boolean): void {
    const target: object = getTarget(Parent, isStatic);
    const metadata: Metadata = MetadataReflector.reflect(target, 'method');

    owner(metadata, target, 'method', null);
    cache(metadata);
}

function methodParameter(isStatic: boolean): void {
    const target: object = getTarget(Parent, isStatic);
    const metadata: Metadata = MetadataReflector.reflect(target, 'method', 0);

    owner(metadata, target, 'method', 0);
    cache(metadata);
}

describe('reflection', (): void => {
    test('class', (): void => {
        expect.hasAssertions();

        const metadata: Metadata = MetadataReflector.reflect(Parent);

        owner(metadata, Parent, null, null);
        cache(metadata);
    });

    test('constructor-parameter', (): void => {
        expect.hasAssertions();

        const metadata: Metadata = MetadataReflector.reflect(Parent, null, 0);

        owner(metadata, Parent, null, 0);
        cache(metadata);
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
