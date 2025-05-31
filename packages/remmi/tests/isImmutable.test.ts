import { describe, expect, it } from "vitest"
import { isImmutable, markAsMutable, startMutations } from "../src/index.js"

describe("isImmutable", () => {
    it("should return false for values marked as mutable", () => {
        expect.hasAssertions()
        startMutations(() => {
            const value = [0]
            markAsMutable(value)
            expect(isImmutable(value)).toBe(false)
        })
    })

    it("should return true for values not marked as mutable", () => {
        expect.hasAssertions()
        startMutations(() => {
            const value = [0]
            expect(isImmutable(value)).toBe(true)
        })
    })

    it("should return true outside mutation contexts", () => {
        const value = [0]
        expect(isImmutable(value)).toBe(true)
    })
})
