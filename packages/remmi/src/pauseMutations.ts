import { ctx } from "./ctx"

/**
 * # pauseMutations
 *
 * ```ts
 * function pauseMutations(fn: () => T): T;
 * ```
 *
 * Temporarily suspends the current mutation context for `fn`. Forwards the result of `fn`.
 *
 * ## Example
 *
 * ```ts
 * import {
 *     startMutations,
 *     pauseMutations,
 *     markAsMutable,
 *     isMutable,
 * } from "@monstermann/remmi";
 *
 * startMutations(() => {
 *     markAsMutable(target);
 *     isMutable(target); //=> true
 *
 *     pauseMutations(() => {
 *         isMutable(target); //=> false
 *         markAsMutable(target);
 *         isMutable(target); //=> false
 *     });
 *
 *     isMutable(target); //=> true
 * });
 * ```
 *
 */
export function pauseMutations<T>(fn: () => T): T {
    try {
        ctx.set(undefined)
        return fn()
    }
    finally {
        ctx.pop()
    }
}
