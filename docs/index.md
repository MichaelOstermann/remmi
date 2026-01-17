---
aside: true
---

# remmi

<Badge type="info" class="size">
    <span>Minified</span>
    <span>685 B</span>
</Badge>

<Badge type="info" class="size">
    <span>Minzipped</span>
    <span>254 B</span>
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
