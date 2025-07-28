# markAsMutable

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
