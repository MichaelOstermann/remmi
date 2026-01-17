import { isMutable } from "./isMutable"

/**
 * # isImmutable
 *
 * ```ts
 * function isImmutable(value: WeakKey): boolean;
 * ```
 *
 * Returns a boolean indicating whether the provided value has not been marked as mutable.
 *
 * ## Example
 *
 * ```ts
 * import {
 *     withMutations,
 *     isImmutable,
 *     markAsMutable,
 *     markAsImmutable,
 * } from "@monstermann/remmi";
 *
 * isImmutable(value); //=> true
 *
 * withMutations(() => {
 *     isImmutable(value); //=> true
 *     markAsMutable(value);
 *     isImmutable(value); //=> false
 *     markAsImmutable(value);
 *     isImmutable(value); //=> true
 * });
 *
 * isImmutable(value); //=> true
 * ```
 *
 */
export function isImmutable(value: WeakKey): boolean {
    return !isMutable(value)
}
