# isMutable

```ts
function isMutable(value: WeakKey): boolean;
```

Returns a boolean indicating whether the provided value has been marked as mutable.

## Example

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
