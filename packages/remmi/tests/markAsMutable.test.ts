import { describe, expect, it } from "vitest"
import { isMutable, markAsMutable, withMutations } from "../src/index"

describe("markAsMutable", () => {
    it("should mark within mutation contexts", () => {
        expect.hasAssertions()
        withMutations(() => {
            const value = [0]
            expect(markAsMutable(value)).toBe(value)
            expect(isMutable(value)).toBe(true)
        })
    })

    it("should have no effect outside mutation contexts", () => {
        const value = [0]
        expect(markAsMutable(value)).toBe(value)
        expect(isMutable(value)).toBe(false)
    })
})
