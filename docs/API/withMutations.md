# withMutations

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
