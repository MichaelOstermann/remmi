type MutationContext = WeakSet<WeakKey>

interface Ctx {
    current: MutationContext | undefined
    stack: (MutationContext | undefined)[]
}

export const ctx: Ctx = {
    current: undefined,
    stack: [],
}
