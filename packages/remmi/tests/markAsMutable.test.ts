import { describe, expect, it } from "vitest"
import { isMutable, markAsMutable, startMutations } from "../src/index"

describe("markAsMutable", () => {
    it("should mark within mutation contexts", () => {
        expect.hasAssertions()
        startMutations(() => {
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
