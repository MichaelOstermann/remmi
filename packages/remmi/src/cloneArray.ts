import { isMutable } from "./isMutable"
import { markAsMutable } from "./markAsMutable"

type WritableArray<T> = T extends readonly [...infer U] ? U : T

/**
 * # cloneArray
 *
 * ```ts
 * function cloneArray(array: ReadonlyArray): Array;
 * ```
 *
 * Returns a mutable copy of `array` (or the original if already mutable).
 *
 * ## Example
 *
 * ```ts
 * import {
 *     withMutations,
 *     isMutable,
 *     markAsMutable,
 *     cloneArray,
 * } from "@monstermann/remmi";
 *
 * const a = [];
 *
 * withMutations(() => {
 *     isMutable(a); //=> false
 *
 *     const b = cloneArray(a);
 *     isMutable(b); //=> true
 *     a === b; //=> false
 *
 *     const c = cloneArray(b);
 *     isMutable(c); //=> true
 *     a === c; //=> false
 *     b === c; //=> true
 * });
 * ```
 *
 */
export function cloneArray<T extends ReadonlyArray<unknown>>(array: T): WritableArray<T> {
    return isMutable(array)
        ? array as WritableArray<T>
        : markAsMutable([...array]) as WritableArray<T>
}
