# cloneArray

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
