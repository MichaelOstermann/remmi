# isMutating

```ts
function isMutating(): boolean;
```

Returns a boolean indicating whether a mutation context is currently available.

## Example

```ts
import { withMutations, isMutating } from "@monstermann/remmi";

isMutating(); //=> false

withMutations(() => {
    isMutating(); //=> true
});

isMutating(); //=> false
```
