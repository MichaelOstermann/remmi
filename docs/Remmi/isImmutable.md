# isImmutable

```ts
function isImmutable(value: WeakKey): boolean;
```

Returns a boolean indicating whether the provided value has not been marked as mutable.

## Example

```ts
import {
    startMutations,
    isImmutable,
    markAsMutable,
    unmarkAsMutable,
} from "@monstermann/remmi";

isImmutable(value); //=> true

startMutations(() => {
    isImmutable(value); //=> true
    markAsMutable(value);
    isImmutable(value); //=> false
    unmarkAsMutable(value);
    isImmutable(value); //=> true
});

isImmutable(value); //=> true
```
