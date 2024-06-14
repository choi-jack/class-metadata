# Class Metadata

Reflection based on TypeScript's experimental support for stage 2 decorators and metadata.

## Getting Started

If you are unfamiliar with decorators and metadata, I recommend checking out the TypeScript documentation and TC39's decorator proposal documentation.

- <https://www.typescriptlang.org/docs/handbook/decorators.html>
- <https://github.com/tc39/proposal-decorators>

### Prerequisites

The following versions of Node.js and TypeScript are required:

- Node.js 16 or higher
- TypeScript 4.7 or higher

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c), and you must configure your project to use the ESM package.

### Installation

1. Install packages.

    ```sh
    npm install class-metadata reflect-metadata
    ```

2. Import the `reflect-metadata` package into your application entry point.

    ```typescript
    import 'reflect-metadata';
    ```

    - It should be imported only once in the entire application, and before other packages.
    - If you distribute a module as a package, it must not be imported and must be installed as a development dependency.

3. Set compiler options in your `tsconfig.json` to enable experimental support for stage 2 decorators and metadata.

    ```json
    {
        "compilerOptions": {
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true
        }
    }
    ```

## Usage

You can read and write metadata through a metadata instance that wraps the metadata reflection API of the `reflect-metadata` package.

Get a metadata instance for a class, its members, and parameters with the `Metadata.of` method.

```typescript
import { Metadata } from 'class-metadata';

@Decorator()
class Class {
    public constructor(
        parameter: string,
    ) { }
}

const metadata: Metadata = Metadata.of(Class);

expect(metadata.get('design:paramtypes')).toStrictEqual([String]);

metadata.set('foo', 'bar');

expect(metadata.get('foo')).toBe('bar');

metadata.delete('foo');

expect(metadata.get('foo')).toBe(null);
```

See the following `Metadata.of` method syntax:

```typescript
// constructor
Metadata.of(Class);

// constructor parameter
Metadata.of(Class, null, 0);

// static property, accessor, method
Metadata.of(Class, 'staticMember');

// static method parameter
Metadata.of(Class, 'staticMethod', 0);

// instance property, accessor, method
Metadata.of(Class.prototype, 'instanceMember');

// instance method parameter
Metadata.of(Class.prototype, 'instanceMethod', 0);
```

### Inheritance

You can read metadata from a parent class from a child class, as shown in the following example.

```typescript
@Decorator()
class Parent {
    public constructor(
        parameter: number,
    ) { }
}

@Decorator()
class Child extends Parent { }

const parentMetadata: Metadata = Metadata.of(Parent);
const childMetadata: Metadata = Metadata.of(Child);

expect(parentMetadata.parent).toBe(null);
expect(childMetadata.parent).toBe(parentMetadata);

expect(childMetadata.get('design:paramtypes')).toStrictEqual([Number]);
expect(childMetadata.getOwn('design:paramtypes')).toBe(null);

parentMetadata.set('foo', 'bar');

expect(childMetadata.get('foo')).toBe('bar');
expect(childMetadata.getOwn('foo')).toBe(null);

childMetadata.set('foo', 'baz');

expect(childMetadata.get('foo')).toBe('baz');
expect(childMetadata.getOwn('foo')).toBe('baz');
```

### Parameter Metadata

TypeScript and the `reflect-metadata` package do not have parameter metadata support, but this package extends the metadata functionality to support parameter metadata.

If `design:paramtypes` metadata is emitted, the `design:type` metadata is set in the parameters metadata.

```typescript
@Decorator()
class Parent {
    public constructor(
        parameter: boolean,
    ) { }
}

@Decorator()
class Child extends Parent { }

const parentParameterMetadata: Metadata = Metadata.of(Parent, null, 0);
const childParameterMetadata: Metadata = Metadata.of(Child, null, 0);

expect(parentParameterMetadata.parent).toBe(null);
expect(childParameterMetadata.parent).toBe(parentParameterMetadata);

expect(childParameterMetadata.get('design:type')).toBe(Boolean);
expect(childParameterMetadata.getOwn('design:type')).toBe(null);
```

You can get all parameter metadata of a constructor or method with the `Metadata.parametersOf` method.

- Returns parameters metadata based on `design:paramtypes` metadata.
- If the emitted design-time metadata is not in the prototype chain, an empty array is returned.

```typescript
const parentParametersMetadata: ReadonlyArray<Metadata> = Metadata.parametersOf(Parent);

expect(parentParametersMetadata).toHaveLength(1);

const childParametersMetadata: ReadonlyArray<Metadata> = Metadata.parametersOf(Child);

expect(childParametersMetadata).toHaveLength(1);
expect(childParametersMetadata[0]).toBe(parentParametersMetadata[0]);
```

See the following `Metadata.parametersOf` method syntax:

```typescript
// constructor parameters
Metadata.parametersOf(Class);

// static method parameters
Metadata.parametersOf(Class, 'staticMethod');

// instance method parameters
Metadata.parametersOf(Class.prototype, 'instanceMethod');
```

### Decorators

You can easily create decorators and decorate them anywhere in your class.

```typescript
@Metadata.decorator((metadata: Metadata): void => { })
class Class {
    @Metadata.decorator((metadata: Metadata): void => { })
    public static staticProperty: unknown;

    @Metadata.decorator((metadata: Metadata): void => { })
    public static get staticGetter(): unknown {
        return;
    }

    @Metadata.decorator((metadata: Metadata): void => { })
    public static set staticSetter(value: unknown) { }

    @Metadata.decorator((metadata: Metadata): void => { })
    public static staticMethod(
        @Metadata.decorator((metadata: Metadata): void => { })
        staticMethodParameter: unknown,
    ): void { }

    @Metadata.decorator((metadata: Metadata): void => { })
    public instanceProperty: unknown;

    public constructor(
        @Metadata.decorator((metadata: Metadata): void => { })
        constructorParameter: unknown,
    ) { }

    @Metadata.decorator((metadata: Metadata): void => { })
    public get instanceGetter(): unknown {
        return;
    }

    @Metadata.decorator((metadata: Metadata): void => { })
    public set instanceSetter(value: unknown) { }

    @Metadata.decorator((metadata: Metadata): void => { })
    public instanceMethod(
        @Metadata.decorator((metadata: Metadata): void => { })
        instanceParameter: unknown,
    ): void { }
}
```

You can also be used with decorator factories and restricts the type of decorator.

```typescript
function CustomClassDecorator(...): ClassDecorator {
    return Metadata.decorator((metadata: Metadata): void => {
        ...
    });
}

function CustomMemberDecorator(...): PropertyDecorator & MethodDecorator {
    return Metadata.decorator((metadata: Metadata): void => {
        ...
    });
}
```

Decorators can be applied dynamically using metadata instances.

```typescript
metadata.decorate([
    Decorator1(...),
    Decorator2(...),
    ...
]);
```

## License

Distributed under the MIT License. See the [LICENSE](https://github.com/choi-jack/class-metadata/blob/main/LICENSE) file for more details.
