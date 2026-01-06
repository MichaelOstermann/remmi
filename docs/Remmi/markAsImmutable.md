# markAsImmutable

```ts
function markAsImmutable(value: WeakKey): WeakKey;
```

Marks the provided value as immutable in the current mutation context.

## Example

```ts
import {
    startMutations,
    isMutable,
    markAsMutable,
    markAsImmutable,
    unmarkAsMutable,
} from "@monstermann/remmi";

startMutations(() => {
    isMutable(value); //=> false
    markAsMutable(value);
    isMutable(value); //=> true
    markAsImmutable(value);
    isMutable(value); //=> false
});
```
