import { describe, expect, it } from "vitest"
import { isMutable, markAsImmutable, markAsMutable, startMutations } from "../src/index"

describe("markAsImmutable", () => {
    it("should unmark within mutation contexts", () => {
        expect.hasAssertions()
        startMutations(() => {
            const value = [0]
            markAsMutable(value)
            expect(isMutable(value)).toBe(true)
            expect(markAsImmutable(value)).toBe(value)
            expect(isMutable(value)).toBe(false)
        })
    })

    it("should have no effect outside mutation contexts", () => {
        const value = [0]
        markAsMutable(value)
        expect(isMutable(value)).toBe(false)
        expect(markAsImmutable(value)).toBe(value)
        expect(isMutable(value)).toBe(false)
    })
})
