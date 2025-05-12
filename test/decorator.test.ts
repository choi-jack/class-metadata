/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { describe, expect, test } from '@jest/globals';

import { Decorator, Metadata, MetadataReflector } from '../src/index.js';

function Decorator(expected: Metadata): Decorator {
    return MetadataReflector.createDecorator((received: Metadata): void => {
        expect(received).toBe(expected);

        received.decorate([
            (target: object, propertyKey?: PropertyKey, descriptorOrParameterIndex?: PropertyDescriptor | number): void => {
                expect(target).toBe(received.target);
                expect(propertyKey).toBe(received.propertyKey ?? undefined);
                expect(descriptorOrParameterIndex).toBe(received.parameterIndex ?? undefined);
            },
        ]);
    });
}

describe('decorator', (): void => {
    test('class', (): void => {
        expect.hasAssertions();

        @Decorator(MetadataReflector.reflect(Class))
        class Class { }
    });

    test('constructor-parameter', (): void => {
        expect.hasAssertions();

        class Class {
            public constructor(
                @Decorator(MetadataReflector.reflect(Class, null, 0))
                parameter: unknown,
            ) { }
        }
    });

    describe('static', (): void => {
        test('field', (): void => {
            expect.hasAssertions();

            class Class {
                @Decorator(MetadataReflector.reflect(Class, 'field'))
                public static field: unknown;
            }
        });

        test('accessor', (): void => {
            expect.hasAssertions();

            class Class {
                @Decorator(MetadataReflector.reflect(Class, 'accessor'))
                public static get accessor(): unknown {
                    return;
                }

                public static set accessor(value: unknown) { }
            }
        });

        test('method', (): void => {
            expect.hasAssertions();

            class Class {
                @Decorator(MetadataReflector.reflect(Class, 'method'))
                public static method(): void { }
            }
        });

        test('method-parameter', (): void => {
            expect.hasAssertions();

            class Class {
                public static method(
                    @Decorator(MetadataReflector.reflect(Class, 'method', 0))
                    parameter: unknown,
                ): void { }
            }
        });
    });

    describe('instance', (): void => {
        test('field', (): void => {
            expect.hasAssertions();

            class Class {
                @Decorator(MetadataReflector.reflect(Class.prototype, 'field'))
                public field: unknown;
            }
        });

        test('accessor', (): void => {
            expect.hasAssertions();

            class Class {
                @Decorator(MetadataReflector.reflect(Class.prototype, 'accessor'))
                public get accessor(): unknown {
                    return;
                }

                public set accessor(value: unknown) { }
            }
        });

        test('method', (): void => {
            expect.hasAssertions();

            class Class {
                @Decorator(MetadataReflector.reflect(Class.prototype, 'method'))
                public method(): void { }
            }
        });

        test('method-parameter', (): void => {
            expect.hasAssertions();

            class Class {
                public method(
                    @Decorator(MetadataReflector.reflect(Class.prototype, 'method', 0))
                    parameter: unknown,
                ): void { }
            }
        });
    });
});
