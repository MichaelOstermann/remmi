import { describe, expect, it } from "vitest"
import { cloneSet, isMutable, markAsMutable, withMutations } from "../src/index"

describe("cloneSet", () => {
    it("should clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = new Set([0])
            const after = cloneSet(before)
            expect(before).not.toBe(after)
            expect(before).toEqual(after)
        })
    })

    it("should mark set as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = new Set([0])
            const after = cloneSet(before)
            expect(isMutable(after)).toBe(true)
        })
    })

    it("should not clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = new Set([0])
            markAsMutable(before)
            const after = cloneSet(before)
            expect(before).toBe(after)
        })
    })

    it("should clone outside mutation contexts", () => {
        const before = new Set([0])
        const after = cloneSet(before)
        expect(before).not.toBe(after)
        expect(before).toEqual(after)
    })
})
