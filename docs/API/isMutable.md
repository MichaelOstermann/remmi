# isMutable

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
