# isMutating

`isMutating()`

Returns a boolean indicating whether a mutation context is currently available.

```ts
import { startMutations, isMutating } from "@monstermann/remmi";

isMutating(); //=> false

startMutations(() => {
    isMutating(); //=> true
});

isMutating(); //=> false
```
