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
 *     withMutations,
 *     pauseMutations,
 *     markAsMutable,
 *     isMutable,
 * } from "@monstermann/remmi";
 *
 * withMutations(() => {
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
        ctx.stack.push(undefined)
        ctx.current = undefined
        return fn()
    }
    finally {
        ctx.stack.pop()
        ctx.current = ctx.stack.at(-1)
    }
}
