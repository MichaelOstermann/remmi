import { isMutable } from "./isMutable"
import { markAsMutable } from "./markAsMutable"

type WritableObject<T> = { -readonly [P in keyof T]: T[P] }

/**
 * # cloneObject
 *
 * ```ts
 * function cloneObject(object: object): object;
 * ```
 *
 * Returns a mutable copy of `object` (or the original if already mutable).
 *
 * ## Example
 *
 * ```ts
 * import {
 *     startMutations,
 *     isMutable,
 *     markAsMutable,
 *     cloneObject,
 * } from "@monstermann/remmi";
 *
 * const a = {};
 *
 * startMutations(() => {
 *     isMutable(a); //=> false
 *
 *     const b = cloneObject(a);
 *     isMutable(b); //=> true
 *     a === b; //=> false
 *
 *     const c = cloneObject(b);
 *     isMutable(c); //=> true
 *     a === c; //=> false
 *     b === c; //=> true
 * });
 * ```
 *
 */
export function cloneObject<T extends object>(object: T): WritableObject<T> {
    return isMutable(object)
        ? object
        : markAsMutable({ ...object })
}
