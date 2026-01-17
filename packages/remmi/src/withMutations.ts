import { endMutations } from "./endMutations"
import { startMutations } from "./startMutations"

/**
 * # withMutations
 *
 * ```ts
 * function withMutations(fn: () => T): T;
 * ```
 *
 * Runs `fn` inside a mutation context, reusing the current one if already active. Forwards the result of `fn`.
 *
 * ## Example
 *
 * ```ts
 * import {
 *     withMutations,
 *     markAsMutable,
 *     markAsImmutable,
 *     isMutable,
 * } from "@monstermann/remmi";
 *
 * withMutations(() => {
 *     markAsMutable(target);
 *     isMutable(target); //=> true
 *
 *     withMutations(() => {
 *         isMutable(target); //=> true
 *         markAsImmutable(target);
 *     });
 *
 *     isMutable(target); //=> false
 * });
 * ```
 *
 */
export function withMutations<T>(fn: () => T): T {
    try {
        startMutations()
        return fn()
    }
    finally {
        endMutations()
    }
}
