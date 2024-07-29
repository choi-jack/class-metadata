import { expect, test } from '@jest/globals';

import { Decorator, Metadata, MetadataKey, MetadataReflector } from '../src/index.js';

test('usage', (): void => {
    const EXAMPLE: MetadataKey<string> = new MetadataKey('example');

    function Example(value: string): Decorator {
        return MetadataReflector.createDecorator((metadata: Metadata): void => {
            metadata.set(EXAMPLE, value);
        });
    }

    @Example('foo')
    class Greeter {
        @Example('bar')
        public readonly defaultGreeting: string;

        public constructor(
            @Example('baz')
            defaultGreeting: string,
        ) {
            this.defaultGreeting = defaultGreeting;
        }

        @Example('qux')
        public greet(
            @Example('quux')
            greeting: string = this.defaultGreeting,
        ): string {
            return `Hello, ${greeting}`;
        }
    }

    const classMetadata: Metadata = MetadataReflector.reflect(Greeter);

    expect(classMetadata.getOwn('design:paramtypes')).toStrictEqual([String]);
    expect(classMetadata.getOwn(EXAMPLE)).toBe('foo');

    const fieldMetadata: Metadata = MetadataReflector.reflect(Greeter.prototype, 'defaultGreeting');

    expect(fieldMetadata.getOwn('design:type')).toBe(String);
    expect(fieldMetadata.getOwn(EXAMPLE)).toBe('bar');

    const methodMetadata: Metadata = MetadataReflector.reflect(Greeter.prototype, 'greet');

    expect(methodMetadata.getOwn('design:type')).toBe(Function);
    expect(methodMetadata.getOwn('design:paramtypes')).toStrictEqual([String]);
    expect(methodMetadata.getOwn('design:returntype')).toBe(String);
    expect(methodMetadata.getOwn(EXAMPLE)).toBe('qux');

    const constructorParameterMetadata: Metadata = MetadataReflector.reflect(Greeter, null, 0);

    expect(constructorParameterMetadata.getOwn('design:type')).toBe(String);
    expect(constructorParameterMetadata.getOwn(EXAMPLE)).toBe('baz');

    const methodParameterMetadata: Metadata = MetadataReflector.reflect(Greeter.prototype, 'greet', 0);

    expect(methodParameterMetadata.getOwn('design:type')).toBe(String);
    expect(methodParameterMetadata.getOwn(EXAMPLE)).toBe('quux');
});
