type MutationContext = WeakSet<WeakKey>

interface Ctx {
    current: MutationContext | undefined
    stack: (MutationContext | undefined)[]
    pop: () => void
    set: (ctx: MutationContext | undefined) => void
}

export const ctx: Ctx = {
    current: undefined,
    stack: [],
    pop() {
        ctx.stack.pop()
        ctx.current = ctx.stack.at(-1)
    },
    set(nextCtx) {
        ctx.stack.push(nextCtx)
        ctx.current = nextCtx
    },
}
