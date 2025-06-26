import { describe, expect, it } from "vitest"
import { cloneArray, isMutable, markAsMutable, startMutations } from "../src/index"

describe("cloneArray", () => {
    it("should clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        startMutations(() => {
            const before = [1]
            const after = cloneArray(before)
            expect(before).not.toBe(after)
            expect(before).toEqual(after)
        })
    })

    it("should mark array as mutable", () => {
        expect.hasAssertions()
        startMutations(() => {
            const before = [1]
            const after = cloneArray(before)
            expect(isMutable(after)).toBe(true)
        })
    })

    it("should not clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        startMutations(() => {
            const before = [1]
            markAsMutable(before)
            const after = cloneArray(before)
            expect(before).toBe(after)
        })
    })

    it("should clone outside mutation contexts", () => {
        const before = [1]
        const after = cloneArray(before)
        expect(before).not.toBe(after)
        expect(before).toEqual(after)
    })
})
