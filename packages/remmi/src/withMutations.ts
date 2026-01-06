import { isMutating } from "./isMutating"
import { startMutations } from "./startMutations"

/**
 * # withMutations
 *
 * ```ts
 * function withMutations(fn: () => T): T;
 * ```
 *
 * Like `startMutations`, but reuses the current mutation context if available.
 *
 * ## Example
 *
 * ```ts
 * import {
 *     withMutations,
 *     markAsMutable,
 *     unmarkAsMutable,
 *     isMutable,
 * } from "@monstermann/remmi";
 *
 * withMutations(() => {
 *     markAsMutable(target);
 *     isMutable(target); //=> true
 *
 *     withMutations(() => {
 *         isMutable(target); //=> true
 *         unmarkAsMutable(target);
 *     });
 *
 *     isMutable(target); //=> false
 * });
 * ```
 *
 */
export function withMutations<T>(fn: () => T): T {
    return isMutating()
        ? fn()
        : startMutations(fn)
}
