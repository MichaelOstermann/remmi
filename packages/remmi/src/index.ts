type MutationContext = WeakSet<WeakKey>
type WritableArray<T> = T extends readonly [...infer U] ? U : T
type WritableObject<T> = { -readonly [P in keyof T]: T[P] }

const stack: (MutationContext | undefined)[] = []
let current: MutationContext | undefined

function setContext(ctx: MutationContext | undefined): void {
    stack.push(ctx)
    current = ctx
}

function popContext(): void {
    stack.pop()
    current = stack.at(-1)
}

/**
 * Returns a boolean indicating whether a mutation context is currently available.
 *
 * ```ts
 * import { startMutations, isMutating } from "@monstermann/remmi";
 *
 * isMutating(); //=> false
 *
 * startMutations(() => {
 *     isMutating(); //=> true
 * });
 *
 * isMutating(); //=> false
 * ```
 */
export function isMutating(): boolean {
    return current !== undefined
}

/**
 * Returns a boolean indicating whether the provided value has been marked as mutable.
 *
 * ```ts
 * import {
 *     startMutations,
 *     isMutable,
 *     markAsMutable,
 *     unmarkAsMutable,
 * } from "@monstermann/remmi";
 *
 * isMutable(value); //=> false
 *
 * startMutations(() => {
 *     isMutable(value); //=> false
 *     markAsMutable(value);
 *     isMutable(value); //=> true
 *     unmarkAsMutable(value);
 *     isMutable(value); //=> false
 * });
 *
 * isMutable(value); //=> false
 * ```
 */
export function isMutable(value: WeakKey): boolean {
    return current?.has(value) === true
}

/**
 * Returns a boolean indicating whether the provided value has not been marked as mutable.
 *
 * ```ts
 * import {
 *     startMutations,
 *     isImmutable,
 *     markAsMutable,
 *     unmarkAsMutable,
 * } from "@monstermann/remmi";
 *
 * isImmutable(value); //=> true
 *
 * startMutations(() => {
 *     isImmutable(value); //=> true
 *     markAsMutable(value);
 *     isImmutable(value); //=> false
 *     unmarkAsMutable(value);
 *     isImmutable(value); //=> true
 * });
 *
 * isImmutable(value); //=> true
 * ```
 */
export function isImmutable(value: WeakKey): boolean {
    return !isMutable(value)
}

/**
 * Marks the provided value as mutable in the current mutation context.
 *
 * ```ts
 * import {
 *     startMutations,
 *     isMutable,
 *     markAsMutable,
 *     unmarkAsMutable,
 * } from "@monstermann/remmi";
 *
 * startMutations(() => {
 *     isMutable(value); //=> false
 *     markAsMutable(value);
 *     isMutable(value); //=> true
 * });
 * ```
 */
export function markAsMutable<T extends WeakKey>(value: T): T {
    current?.add(value)
    return value
}

/**
 * Marks the provided value as immutable in the current mutation context.
 *
 * ```ts
 * import {
 *     startMutations,
 *     isMutable,
 *     markAsMutable,
 *     markAsImmutable,
 *     unmarkAsMutable,
 * } from "@monstermann/remmi";
 *
 * startMutations(() => {
 *     isMutable(value); //=> false
 *     markAsMutable(value);
 *     isMutable(value); //=> true
 *     markAsImmutable(value);
 *     isMutable(value); //=> false
 * });
 * ```
 */
export function markAsImmutable<T extends WeakKey>(value: T): T {
    current?.delete(value)
    return value
}

/**
 * Runs `fn` inside a new mutation context. Forwards the result of `fn`.
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
 */
export function startMutations<T>(fn: () => T): T {
    try {
        setContext(new WeakSet())
        return fn()
    }
    finally {
        popContext()
    }
}

/**
 * Temporarily suspends the current mutation context for `fn`. Forwards the result of `fn`.
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
 */
export function pauseMutations<T>(fn: () => T): T {
    try {
        setContext(undefined)
        return fn()
    }
    finally {
        popContext()
    }
}

/**
 * Like `startMutations`, but reuses the current mutation context if available.
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
 */
export function withMutations<T>(fn: () => T): T {
    return isMutating()
        ? fn()
        : startMutations(fn)
}

/**
 * Returns a mutable copy of `array` (or the original if already mutable).
 *
 * ```ts
 * import {
 *     startMutations,
 *     isMutable,
 *     markAsMutable,
 *     cloneArray,
 * } from "@monstermann/remmi";
 *
 * const a = [];
 *
 * startMutations(() => {
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
 */
export function cloneArray<T extends ReadonlyArray<unknown>>(array: T): WritableArray<T> {
    return isMutable(array)
        ? array as WritableArray<T>
        : markAsMutable([...array]) as WritableArray<T>
}

/**
 * Returns a mutable copy of `object` (or the original if already mutable).
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
 */
export function cloneObject<T extends object>(object: T): WritableObject<T> {
    return isMutable(object)
        ? object
        : markAsMutable({ ...object })
}

/**
 * Returns a mutable copy of `map` (or the original if already mutable).
 *
 * ```ts
 * import {
 *     startMutations,
 *     isMutable,
 *     markAsMutable,
 *     cloneMap,
 * } from "@monstermann/remmi";
 *
 * const a = new Map();
 *
 * startMutations(() => {
 *     isMutable(a); //=> false
 *
 *     const b = cloneMap(a);
 *     isMutable(b); //=> true
 *     a === b; //=> false
 *
 *     const c = cloneMap(b);
 *     isMutable(c); //=> true
 *     a === c; //=> false
 *     b === c; //=> true
 * });
 * ```
 */
export function cloneMap<K, V>(map: ReadonlyMap<K, V>): Map<K, V> {
    return isMutable(map)
        ? map as Map<K, V>
        : markAsMutable(new Map(map))
}

/**
 * Returns a mutable copy of `set` (or the original if already mutable).
 *
 * ```ts
 * import {
 *     startMutations,
 *     isMutable,
 *     markAsMutable,
 *     cloneSet,
 * } from "@monstermann/remmi";
 *
 * const a = new Set();
 *
 * startMutations(() => {
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
 */
export function cloneSet<T>(set: ReadonlySet<T>): Set<T> {
    return isMutable(set)
        ? set as Set<T>
        : markAsMutable(new Set(set))
}
