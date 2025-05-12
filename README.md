# Class Metadata

Metadata reflection based on TypeScript's experimental support for stage 2 decorators and metadata.

## Getting Started

If you are unfamiliar with decorators and metadata, I recommend checking out the TypeScript documentation and TC39's decorator proposal documentation.

- <https://www.typescriptlang.org/docs/handbook/decorators.html>
- <https://github.com/tc39/proposal-decorators>

### Prerequisites

The following versions of Node.js and TypeScript are required:

- Node.js 20 or higher
- TypeScript 4.7 or higher

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c), and you must configure your project to use the ESM package.

### Installation

#### 1. Install the package using npm

```sh
npm install class-metadata
```

#### 2. Set compiler options in your `tsconfig.json` to enable experimental support for stage 2 decorators and metadata

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

## Usage

You can read and write metadata of classes, class members, and parameters.

It is recommended to use the `MetadataKey` class to handle metadata type-safely.

```typescript
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
```

Metadata for classes and class members is provided by the `reflect-metadata` package.

```typescript
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
```

Metadata for parameters is provided by the `Map` object.

If the class or method has `design:paramtypes` metadata, the `design:type` metadata is set on the parameter.

```typescript
const constructorParameterMetadata: Metadata = MetadataReflector.reflect(Greeter, null, 0);

expect(constructorParameterMetadata.getOwn('design:type')).toBe(String);
expect(constructorParameterMetadata.getOwn(EXAMPLE)).toBe('baz');

const methodParameterMetadata: Metadata = MetadataReflector.reflect(Greeter.prototype, 'greet', 0);

expect(methodParameterMetadata.getOwn('design:type')).toBe(String);
expect(methodParameterMetadata.getOwn(EXAMPLE)).toBe('quux');
```

You can also apply decorators dynamically.

No descriptor is passed to the decorator, and the returned value is ignored.

```typescript
classMetadata.decorate([
    Example('corge'),
]);

expect(classMetadata.getOwn(EXAMPLE)).toBe('corge');
```

## License

Distributed under the MIT License. See the [LICENSE](https://github.com/choi-jack/class-metadata/blob/main/LICENSE) file for more details.
