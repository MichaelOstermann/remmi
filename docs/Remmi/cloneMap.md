# cloneMap

```ts
function cloneMap(map: Map): Map;
```

Returns a mutable copy of `map` (or the original if already mutable).

## Example

```ts
import {
    withMutations,
    isMutable,
    markAsMutable,
    cloneMap,
} from "@monstermann/remmi";

const a = new Map();

withMutations(() => {
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
