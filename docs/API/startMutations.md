# startMutations

`startMutations(fn)`

Runs `fn` inside a new mutation context. Forwards the result of `fn`.

```ts
import { startMutations, markAsMutable, isMutable } from "@monstermann/remmi";

isMutable(target); //=> false

startMutations(() => {
    markAsMutable(target);
    isMutable(target); //=> true
    return true;
}); //=> true

isMutable(target); //=> false
```
