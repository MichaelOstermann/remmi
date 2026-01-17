# markAsMutable

```ts
function markAsMutable(value: WeakKey): WeakKey;
```

Marks the provided value as mutable in the current mutation context.

## Example

```ts
import {
    withMutations,
    isMutable,
    markAsMutable,
    markAsImmutable,
} from "@monstermann/remmi";

withMutations(() => {
    isMutable(value); //=> false
    markAsMutable(value);
    isMutable(value); //=> true
});
```
