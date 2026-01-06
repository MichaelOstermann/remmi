# isMutating

```ts
function isMutating(): boolean;
```

Returns a boolean indicating whether a mutation context is currently available.

## Example

```ts
import { startMutations, isMutating } from "@monstermann/remmi";

isMutating(); //=> false

startMutations(() => {
    isMutating(); //=> true
});

isMutating(); //=> false
```
