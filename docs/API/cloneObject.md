# cloneObject

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
