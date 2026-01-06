# cloneSet

```ts
function cloneSet(set: ReadonlySet): Set;
```

Returns a mutable copy of `set` (or the original if already mutable).

## Example

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
