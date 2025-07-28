# pauseMutations

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
