import { ctx } from "./ctx"

/**
 * # startMutations
 *
 * ```ts
 * function startMutations(fn: () => T): T;
 * ```
 *
 * Runs `fn` inside a new mutation context. Forwards the result of `fn`.
 *
 * ## Example
 *
 * ```ts
 * import { startMutations, markAsMutable, isMutable } from "@monstermann/remmi";
 *
 * isMutable(target); //=> false
 *
 * startMutations(() => {
 *     markAsMutable(target);
 *     isMutable(target); //=> true
 *     return true;
 * }); //=> true
 *
 * isMutable(target); //=> false
 * ```
 *
 */
export function startMutations<T>(fn: () => T): T {
    try {
        ctx.set(new WeakSet())
        return fn()
    }
    finally {
        ctx.pop()
    }
}
