import { isMutable } from "./isMutable"
import { markAsMutable } from "./markAsMutable"

/**
 * # cloneSet
 *
 * ```ts
 * function cloneSet(set: ReadonlySet): Set;
 * ```
 *
 * Returns a mutable copy of `set` (or the original if already mutable).
 *
 * ## Example
 *
 * ```ts
 * import {
 *     withMutations,
 *     isMutable,
 *     markAsMutable,
 *     cloneSet,
 * } from "@monstermann/remmi";
 *
 * const a = new Set();
 *
 * withMutations(() => {
 *     isMutable(a); //=> false
 *
 *     const b = cloneSet(a);
 *     isMutable(b); //=> true
 *     a === b; //=> false
 *
 *     const c = cloneSet(b);
 *     isMutable(c); //=> true
 *     a === c; //=> false
 *     b === c; //=> true
 * });
 * ```
 *
 */
export function cloneSet<T>(set: ReadonlySet<T>): Set<T> {
    return isMutable(set)
        ? set as Set<T>
        : markAsMutable(new Set(set))
}
