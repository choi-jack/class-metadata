import { MetadataKey } from './metadata-key.js';

export type MetadataType<Key> = Key extends MetadataKey<infer Type>
    ? Type
    : unknown;
