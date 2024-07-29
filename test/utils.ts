import { Class } from '../src/index.js';

export function getTarget(clazz: Class, isStatic: boolean): object {
    if (isStatic) {
        return clazz;
    }

    return clazz.prototype;
}
