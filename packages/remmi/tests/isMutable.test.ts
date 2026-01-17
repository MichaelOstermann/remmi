import { describe, expect, it } from "vitest"
import { isMutable, markAsMutable, withMutations } from "../src/index"

describe("isMutable", () => {
    it("should return true for values marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const value = [0]
            markAsMutable(value)
            expect(isMutable(value)).toBe(true)
        })
    })

    it("should return false for values not marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const value = [0]
            expect(isMutable(value)).toBe(false)
        })
    })

    it("should return false outside mutation contexts", () => {
        const value = [0]
        expect(isMutable(value)).toBe(false)
    })
})
