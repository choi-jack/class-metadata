/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-useless-constructor */
import { describe, expect, test } from '@jest/globals';

import { Metadata } from './metadata.js';

function Decorator(): ClassDecorator & PropertyDecorator & MethodDecorator & ParameterDecorator {
    return Metadata.decorator((): void => { });
}

function owner(metadata: Metadata, target: object, propertyKey: null | PropertyKey, parameterIndex: null | number): void {
    expect(metadata.target).toBe(target);
    expect(metadata.propertyKey).toBe(propertyKey);
    expect(metadata.parameterIndex).toBe(parameterIndex);
}

function decorator(outer: Metadata): void {
    outer.decorate([
        Metadata.decorator((inner: Metadata): void => {
            expect(inner).toBe(inner);
        }),
    ]);
}

function designType(metadata: Metadata, type: unknown): void {
    expect(metadata.hasOwn('design:type')).toBe(true);
    expect(metadata.getOwn('design:type')).toBe(type);
}

function designParamTypes(metadata: Metadata, types: ReadonlyArray<unknown>): void {
    expect(metadata.hasOwn('design:paramtypes')).toBe(true);
    expect(metadata.getOwn('design:paramtypes')).toStrictEqual(types);
}

function designReturnType(metadata: Metadata, type: unknown): void {
    expect(metadata.hasOwn('design:returntype')).toBe(true);
    expect(metadata.getOwn('design:returntype')).toBe(type);
}

function inheritance(name: string, parentMetadata: Metadata, childMetadata: Metadata): void {
    test(name, (): void => {
        expect(parentMetadata.parent).toBe(null);
        expect(childMetadata.parent).toBe(parentMetadata);

        expect(parentMetadata.has('value')).toBe(false);
        expect(parentMetadata.hasOwn('value')).toBe(false);
        expect(parentMetadata.get('value')).toBe(null);
        expect(parentMetadata.getOwn('value')).toBe(null);

        expect(childMetadata.has('value')).toBe(false);
        expect(childMetadata.hasOwn('value')).toBe(false);
        expect(childMetadata.get('value')).toBe(null);
        expect(childMetadata.getOwn('value')).toBe(null);

        parentMetadata.set('value', 'foo');

        expect(parentMetadata.has('value')).toBe(true);
        expect(parentMetadata.hasOwn('value')).toBe(true);
        expect(parentMetadata.get('value')).toBe('foo');
        expect(parentMetadata.getOwn('value')).toBe('foo');

        expect(childMetadata.has('value')).toBe(true);
        expect(childMetadata.hasOwn('value')).toBe(false);
        expect(childMetadata.get('value')).toBe('foo');
        expect(childMetadata.getOwn('value')).toBe(null);

        childMetadata.set('value', 'bar');

        expect(parentMetadata.has('value')).toBe(true);
        expect(parentMetadata.hasOwn('value')).toBe(true);
        expect(parentMetadata.get('value')).toBe('foo');
        expect(parentMetadata.getOwn('value')).toBe('foo');

        expect(childMetadata.has('value')).toBe(true);
        expect(childMetadata.hasOwn('value')).toBe(true);
        expect(childMetadata.get('value')).toBe('bar');
        expect(childMetadata.getOwn('value')).toBe('bar');

        childMetadata.delete('value');

        expect(parentMetadata.has('value')).toBe(true);
        expect(parentMetadata.hasOwn('value')).toBe(true);
        expect(parentMetadata.get('value')).toBe('foo');
        expect(parentMetadata.getOwn('value')).toBe('foo');

        expect(childMetadata.has('value')).toBe(true);
        expect(childMetadata.hasOwn('value')).toBe(false);
        expect(childMetadata.get('value')).toBe('foo');
        expect(childMetadata.getOwn('value')).toBe(null);

        parentMetadata.delete('value');

        expect(parentMetadata.has('value')).toBe(false);
        expect(parentMetadata.hasOwn('value')).toBe(false);
        expect(parentMetadata.get('value')).toBe(null);
        expect(parentMetadata.getOwn('value')).toBe(null);

        expect(childMetadata.has('value')).toBe(false);
        expect(childMetadata.hasOwn('value')).toBe(false);
        expect(childMetadata.get('value')).toBe(null);
        expect(childMetadata.getOwn('value')).toBe(null);
    });
}

test('reflection', (): void => {
    @Metadata.decorator((metadata: Metadata): void => {
        owner(metadata, Class, null, null);
        decorator(metadata);
        designParamTypes(metadata, [
            BigInt,
            Array,
        ]);
    })
    class Class {
        @Metadata.decorator((metadata: Metadata): void => {
            owner(metadata, Class, 'staticProperty', null);
            decorator(metadata);
            designType(metadata, String);
        })
        public static readonly staticProperty: string = '';

        @Metadata.decorator((metadata: Metadata): void => {
            owner(metadata, Class, 'staticMethod', null);
            decorator(metadata);
            designParamTypes(metadata, [
                Boolean,
                Symbol,
            ]);
            designReturnType(metadata, Number);
        })
        public static staticMethod(
            @Metadata.decorator((metadata: Metadata): void => {
                owner(metadata, Class, 'staticMethod', 0);
                decorator(metadata);
                designType(metadata, Boolean);
            })
            staticMethodParameter1: boolean,

            @Metadata.decorator((metadata: Metadata): void => {
                owner(metadata, Class, 'staticMethod', 1);
                decorator(metadata);
                designType(metadata, Symbol);
            })
            @Metadata.decorator((): void => { })
            staticMethodParameter2: symbol,
        ): number {
            return 0;
        }

        @Metadata.decorator((metadata: Metadata): void => {
            owner(metadata, Class.prototype, 'instanceProperty', null);
            decorator(metadata);
            designType(metadata, Number);
        })
        public readonly instanceProperty: number;

        public constructor(
            @Metadata.decorator((metadata: Metadata): void => {
                owner(metadata, Class, null, 0);
                decorator(metadata);
                designType(metadata, BigInt);
            })
            constructorParameter1: bigint,

            @Metadata.decorator((metadata: Metadata): void => {
                owner(metadata, Class, null, 1);
                decorator(metadata);
                designType(metadata, Array);
            })
            constructorParameter2: [],
        ) {
            this.instanceProperty = 0;
        }

        @Metadata.decorator((metadata: Metadata): void => {
            owner(metadata, Class.prototype, 'instanceMethod', null);
            decorator(metadata);
            designParamTypes(metadata, [
                Symbol,
                Boolean,
            ]);
            designReturnType(metadata, String);
        })
        public instanceMethod(
            @Metadata.decorator((metadata: Metadata): void => {
                owner(metadata, Class.prototype, 'instanceMethod', 0);
                decorator(metadata);
                designType(metadata, Symbol);
            })
            constructorParameter1: symbol,

            @Metadata.decorator((metadata: Metadata): void => {
                owner(metadata, Class.prototype, 'instanceMethod', 1);
                decorator(metadata);
                designType(metadata, Boolean);
            })
            constructorParameter2: boolean,
        ): string {
            return '';
        }
    }
});

describe('inheritance', (): void => {
    class Parent { }

    class Child extends Parent { }

    inheritance('class', Metadata.of(Parent), Metadata.of(Child));
    inheritance('constructor-parameter', Metadata.of(Parent, null, 0), Metadata.of(Child, null, 0));
    inheritance('static-member', Metadata.of(Parent, 'staticMember'), Metadata.of(Child, 'staticMember'));
    inheritance('static-method-parameter', Metadata.of(Parent, 'staticMethod', 0), Metadata.of(Child, 'staticMethod', 0));
    inheritance('instance-member', Metadata.of(Parent.prototype, 'instanceMember'), Metadata.of(Child.prototype, 'instanceMember'));
    inheritance('instance-method-parameter', Metadata.of(Parent.prototype, 'instanceMethod', 0), Metadata.of(Child.prototype, 'instanceMethod', 0));
});

test('Metadata.parametersOf', (): void => {
    class Empty { }

    expect(Metadata.parametersOf(Empty)).toHaveLength(0);
    expect(Metadata.parametersOf(Empty, 'staticMethod')).toHaveLength(0);
    expect(Metadata.parametersOf(Empty.prototype, 'instanceMethod')).toHaveLength(0);

    @Decorator()
    class Parent {
        @Decorator()
        public static staticMethod(
            staticMethodParameter: unknown,
        ): void { }

        public constructor(
            constructorParameter: unknown,
        ) { }

        @Decorator()
        public instanceMethod(
            instanceMethodParameter: unknown,
        ): void { }
    }

    @Decorator()
    class Child1 extends Parent {
        @Decorator()
        public static staticMethod(): void { }

        public constructor() {
            super(null);
        }

        @Decorator()
        public instanceMethod(): void { }
    }

    class Child2 extends Parent { }

    expect(Metadata.parametersOf(Parent)).toHaveLength(1);
    expect(Metadata.parametersOf(Parent, 'staticMethod')).toHaveLength(1);
    expect(Metadata.parametersOf(Parent.prototype, 'instanceMethod')).toHaveLength(1);

    expect(Metadata.parametersOf(Child1)).toHaveLength(0);
    expect(Metadata.parametersOf(Child1, 'staticMethod')).toHaveLength(0);
    expect(Metadata.parametersOf(Child1.prototype, 'instanceMethod')).toHaveLength(0);

    expect(Metadata.parametersOf(Child2)).toHaveLength(1);
    expect(Metadata.parametersOf(Child2, 'staticMethod')).toHaveLength(1);
    expect(Metadata.parametersOf(Child2.prototype, 'instanceMethod')).toHaveLength(1);
});
