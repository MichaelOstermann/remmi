<div align="center">

<h1>remmi</h1>

![Minified](https://img.shields.io/badge/Minified-652_B-blue?style=flat-square&labelColor=%2315161D&color=%2369a1ff) ![Minzipped](https://img.shields.io/badge/Minzipped-253_B-blue?style=flat-square&labelColor=%2315161D&color=%2369a1ff)

**Reverse immer.**

[Documentation](https://MichaelOstermann.github.io/remmi)

</div>

## Example

An example for a typical immutable `push`:

```ts
function push(target, value) {
    return [...target, value];
}

const a = [];
const b = push(a, 0);
const c = push(b, 1);
const d = push(c, 2);

a; //=> []
d; //=> [0, 1, 2]
```

But this copies the array every time, sometimes you might want to have something like this instead:

```ts
const before = [];

const after = [...before, 0]; // copy
after.push(1); // write
after.push(2); // write

before; //=> []
after; //=> [0, 1, 2]
```

This is what `remmi` allows you to do!

v1:

```ts
import { cloneArray } from "@monstermann/remmi";

function push(target, value) {
    // Clone this array and mark it as mutable if we haven't done so already,
    // otherwise keep it as-is:
    target = cloneArray(target);

    // Mutate it:
    target.push(value);

    return target;
}
```

v2:

```ts
import { isMutable, markAsMutable } from "@monstermann/remmi";

function push(target, value) {
    if (isMutable(target)) {
        // If this array has been marked as mutable, then mutate it:
        target.push(value);
        return target;
    } else {
        // Otherwise clone it and mark it as mutable:
        return markAsMutable([...target, value]);
    }
}
```

And now let's use it:

```ts
const a = [];
const b = push(a, 0); // copy
const c = push(b, 1); // copy
const d = push(c, 2); // copy

a; //=> []
d; //=> [0, 1, 2]
```

```ts
const before = [];

const after = withMutations(() => {
    const a = before;
    const b = push(a, 0); // copy
    const c = push(b, 1); // write
    const d = push(c, 2); // write
    return d;
});

before; //=> []
after; //=> [0, 1, 2]
```

## Benchmarks

### push(array, value)

Test: Pushing values into an empty array _(Apple M1 Max, Node v24.0.1)_

| name                        |       summary | ops/sec | time/op | margin | samples |
| --------------------------- | ------------: | ------: | ------: | :----: | ------: |
| mutation                    |            🥇 |     25M |    34ns | ±1.60% |     29M |
| **remmi (`withMutations`)** |   2.4x slower |      7M |   148ns | ±6.57% |      7M |
| copy + mutation             |   4.2x slower |      5M |   253ns | ±8.84% |      4M |
| **remmi**                   |   4.9x slower |      4M |   256ns | ±0.77% |      4M |
| mutative                    | 161.3x slower |    155K |     7µs | ±0.85% |    148K |
| immer                       | 277.7x slower |     90K |    12µs | ±6.48% |     86K |

### replace(array, value, replacement)

Test: Replacing elements in a populated array _(Apple M1 Max, Node v24.0.1)_

| name                        |       summary | ops/sec | time/op | margin | samples |
| --------------------------- | ------------: | ------: | ------: | :----: | ------: |
| mutation                    |            🥇 |      2K |   430µs | ±0.23% |      2K |
| **remmi (`withMutations`)** |   0.0x slower |      2K |   442µs | ±0.24% |      2K |
| **remmi**                   |   6.1x slower |     330 |     3ms | ±0.26% |     331 |
| copy + mutation             |   6.2x slower |     325 |     3ms | ±0.79% |     325 |
| mutative                    | 163.4x slower |      14 |    71ms | ±0.11% |      64 |
| immer                       | 204.9x slower |      11 |    88ms | ±0.22% |      64 |

## How it works

`remmi` uses a global context stack to track which objects are mutable within a given scope. When you enter a mutation context, you can mark values as mutable and mutate them in-place. Outside a context, all updates are persistent (immutable).

```ts [Setup]
const contexts: WeakSet<unknown>[] = [];

function startContext(): void {
    contexts.push(new WeakSet());
}

function endContext(): void {
    contexts.pop();
}

function markAsMutable<T extends WeakKey>(value: T): T {
    contexts.at(-1)?.add(value);
    return value;
}

function isMutable<T extends WeakKey>(value: T): boolean {
    return contexts.at(-1)?.has(value) === true;
}
```

```ts [Usage]
function push<T>(target: T[], value: T): T[] {
    target = isMutable(target) ? target : markAsMutable([...target]);
    target.push(value);
    return target;
}

const a1 = [];
const a2 = push(a1, 0); // copy
const a3 = push(a2, 1); // copy

startContext();

const a4 = push(a3, 2); // copy
const a5 = push(a4, 2); // write
const a6 = push(a5, 2); // write

endContext();

const a7 = push(a6, 2); // copy
const a8 = push(a7, 2); // [!code error]
```

## Installation

```sh [npm]
npm install @monstermann/remmi
```

```sh [pnpm]
pnpm add @monstermann/remmi
```

```sh [yarn]
yarn add @monstermann/remmi
```

```sh [bun]
bun add @monstermann/remmi
```

## Remmi

### cloneArray

```ts
function cloneArray(array: ReadonlyArray): Array;
```

Returns a mutable copy of `array` (or the original if already mutable).

#### Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    cloneArray,
} from "@monstermann/remmi";

const a = [];

startMutations(() => {
    isMutable(a); //=> false

    const b = cloneArray(a);
    isMutable(b); //=> true
    a === b; //=> false

    const c = cloneArray(b);
    isMutable(c); //=> true
    a === c; //=> false
    b === c; //=> true
});
```

### cloneMap

```ts
function cloneMap(map: Map): Map;
```

Returns a mutable copy of `map` (or the original if already mutable).

#### Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    cloneMap,
} from "@monstermann/remmi";

const a = new Map();

startMutations(() => {
    isMutable(a); //=> false

    const b = cloneMap(a);
    isMutable(b); //=> true
    a === b; //=> false

    const c = cloneMap(b);
    isMutable(c); //=> true
    a === c; //=> false
    b === c; //=> true
});
```

### cloneObject

```ts
function cloneObject(object: object): object;
```

Returns a mutable copy of `object` (or the original if already mutable).

#### Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    cloneObject,
} from "@monstermann/remmi";

const a = {};

startMutations(() => {
    isMutable(a); //=> false

    const b = cloneObject(a);
    isMutable(b); //=> true
    a === b; //=> false

    const c = cloneObject(b);
    isMutable(c); //=> true
    a === c; //=> false
    b === c; //=> true
});
```

### cloneSet

```ts
function cloneSet(set: ReadonlySet): Set;
```

Returns a mutable copy of `set` (or the original if already mutable).

#### Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    cloneSet,
} from "@monstermann/remmi";

const a = new Set();

startMutations(() => {
    isMutable(a); //=> false

    const b = cloneSet(a);
    isMutable(b); //=> true
    a === b; //=> false

    const c = cloneSet(b);
    isMutable(c); //=> true
    a === c; //=> false
    b === c; //=> true
});
```

### isImmutable

```ts
function isImmutable(value: WeakKey): boolean;
```

Returns a boolean indicating whether the provided value has not been marked as mutable.

#### Example

```ts
import {
    startMutations,
    isImmutable,
    markAsMutable,
    unmarkAsMutable,
} from "@monstermann/remmi";

isImmutable(value); //=> true

startMutations(() => {
    isImmutable(value); //=> true
    markAsMutable(value);
    isImmutable(value); //=> false
    unmarkAsMutable(value);
    isImmutable(value); //=> true
});

isImmutable(value); //=> true
```

### isMutable

```ts
function isMutable(value: WeakKey): boolean;
```

Returns a boolean indicating whether the provided value has been marked as mutable.

#### Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    unmarkAsMutable,
} from "@monstermann/remmi";

isMutable(value); //=> false

startMutations(() => {
    isMutable(value); //=> false
    markAsMutable(value);
    isMutable(value); //=> true
    unmarkAsMutable(value);
    isMutable(value); //=> false
});

isMutable(value); //=> false
```

### isMutating

```ts
function isMutating(): boolean;
```

Returns a boolean indicating whether a mutation context is currently available.

#### Example

```ts
import { startMutations, isMutating } from "@monstermann/remmi";

isMutating(); //=> false

startMutations(() => {
    isMutating(); //=> true
});

isMutating(); //=> false
```

### markAsImmutable

```ts
function markAsImmutable(value: WeakKey): WeakKey;
```

Marks the provided value as immutable in the current mutation context.

#### Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    markAsImmutable,
    unmarkAsMutable,
} from "@monstermann/remmi";

startMutations(() => {
    isMutable(value); //=> false
    markAsMutable(value);
    isMutable(value); //=> true
    markAsImmutable(value);
    isMutable(value); //=> false
});
```

### markAsMutable

```ts
function markAsMutable(value: WeakKey): WeakKey;
```

Marks the provided value as mutable in the current mutation context.

#### Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    unmarkAsMutable,
} from "@monstermann/remmi";

startMutations(() => {
    isMutable(value); //=> false
    markAsMutable(value);
    isMutable(value); //=> true
});
```

### pauseMutations

```ts
function pauseMutations(fn: () => T): T;
```

Temporarily suspends the current mutation context for `fn`. Forwards the result of `fn`.

#### Example

```ts
import {
    startMutations,
    pauseMutations,
    markAsMutable,
    isMutable,
} from "@monstermann/remmi";

startMutations(() => {
    markAsMutable(target);
    isMutable(target); //=> true

    pauseMutations(() => {
        isMutable(target); //=> false
        markAsMutable(target);
        isMutable(target); //=> false
    });

    isMutable(target); //=> true
});
```

### startMutations

```ts
function startMutations(fn: () => T): T;
```

Runs `fn` inside a new mutation context. Forwards the result of `fn`.

#### Example

```ts
import { startMutations, markAsMutable, isMutable } from "@monstermann/remmi";

isMutable(target); //=> false

startMutations(() => {
    markAsMutable(target);
    isMutable(target); //=> true
    return true;
}); //=> true

isMutable(target); //=> false
```

### withMutations

```ts
function withMutations(fn: () => T): T;
```

Like `startMutations`, but reuses the current mutation context if available.

#### Example

```ts
import {
    withMutations,
    markAsMutable,
    unmarkAsMutable,
    isMutable,
} from "@monstermann/remmi";

withMutations(() => {
    markAsMutable(target);
    isMutable(target); //=> true

    withMutations(() => {
        isMutable(target); //=> true
        unmarkAsMutable(target);
    });

    isMutable(target); //=> false
});
```
