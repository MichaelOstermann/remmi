# markAsMutable

```ts
function markAsMutable(value: WeakKey): WeakKey;
```

Marks the provided value as mutable in the current mutation context.

## Example

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
