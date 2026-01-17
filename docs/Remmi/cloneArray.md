# cloneArray

```ts
function cloneArray(array: ReadonlyArray): Array;
```

Returns a mutable copy of `array` (or the original if already mutable).

## Example

```ts
import {
    withMutations,
    isMutable,
    markAsMutable,
    cloneArray,
} from "@monstermann/remmi";

const a = [];

withMutations(() => {
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
