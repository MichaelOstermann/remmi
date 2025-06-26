# remmi

<Badge type="info" class="size">
    <span>Minified</span>
    <span>561 B</span>
</Badge>

<Badge type="info" class="size">
    <span>Minzipped</span>
    <span>223 B</span>
</Badge>

**Reverse immer: Immutable by default, mutable when you need it.**

Libraries like [`immer`](https://github.com/immerjs/immer) or [`mutative`](https://github.com/unadlib/mutative) let you write code that appears to mutate data, but actually creates immutable updates under the hood.

`remmi` flips this approach: You write code that treats data as immutable by default, but can opt-in to efficient, copy-on-write mutations for performance-critical code paths.

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

<Badge type="danger" text="copy" />
<Badge type="warning" text="write" />

```ts
const before = [];

const after = [...before, 0]; // [!code error]
after.push(1); // [!code warning]
after.push(2); // [!code warning]

before; //=> []
after; //=> [0, 1, 2]
```

This is what `remmi` allows you to do!

::: code-group

```ts [v1]
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

```ts [v2]
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

:::

And now let's use it:

<Badge type="danger" text="copy" />
<Badge type="warning" text="write" />

::: code-group

```ts [copy]
const a = [];
const b = push(a, 0); // [!code error]
const c = push(b, 1); // [!code error]
const d = push(c, 2); // [!code error]

a; //=> []
d; //=> [0, 1, 2]
```

```ts [copy-on-write]
const before = [];

const after = withMutations(() => {
    const a = before;
    const b = push(a, 0); // [!code error]
    const c = push(b, 1); // [!code warning]
    const d = push(c, 2); // [!code warning]
    return d;
});

before; //=> []
after; //=> [0, 1, 2]
```

:::

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

<Badge type="danger" text="copy" />
<Badge type="warning" text="write" />

```ts [Usage]
function push<T>(target: T[], value: T): T[] {
    target = isMutable(target) ? target : markAsMutable([...target]);
    target.push(value);
    return target;
}

const a1 = [];
const a2 = push(a1, 0); // [!code error]
const a3 = push(a2, 1); // [!code error]

startContext();

const a4 = push(a3, 2); // [!code error]
const a5 = push(a4, 2); // [!code warning]
const a6 = push(a5, 2); // [!code warning]

endContext();

const a7 = push(a6, 2); // [!code error]
const a8 = push(a7, 2); // [!code error]
```

## Installation

::: code-group

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

:::

## API

### startMutations

`startMutations(fn)`

Runs `fn` inside a new mutation context. Forwards the result of `fn`.

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

### pauseMutations

`pauseMutations(fn)`

Temporarily suspends the current mutation context for `fn`. Forwards the result of `fn`.

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

### withMutations

`withMutations(fn)`

Like `startMutations`, but reuses the current mutation context if available.

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

### isMutating

`isMutating()`

Returns a boolean indicating whether a mutation context is currently available.

```ts
import { startMutations, isMutating } from "@monstermann/remmi";

isMutating(); //=> false

startMutations(() => {
    isMutating(); //=> true
});

isMutating(); //=> false
```

### isMutable

`isMutable(value)`

Returns a boolean indicating whether the provided value has been marked as mutable.

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

### isImmutable

`isImmutable(value)`

Returns a boolean indicating whether the provided value has not been marked as mutable.

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

### markAsMutable

`markAsMutable(value)`

Marks the provided value as mutable in the current mutation context.

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

### markAsImmutable

`markAsImmutable(value)`

Marks the provided value as immutable in the current mutation context.

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

### cloneObject

`cloneObject(object)`

Returns a mutable copy of `object` (or the original if already mutable).

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

### cloneArray

`cloneArray(array)`

Returns a mutable copy of `array` (or the original if already mutable).

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

`cloneMap(map)`

Returns a mutable copy of `map` (or the original if already mutable).

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

### cloneSet

`cloneSet(set)`

Returns a mutable copy of `set` (or the original if already mutable).

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
