import { describe, expect, it } from "vitest"
import { cloneMap, isMutable, markAsMutable, withMutations } from "../src/index"

describe("cloneMap", () => {
    it("should clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = new Map([[1, 1]])
            const after = cloneMap(before)
            expect(before).not.toBe(after)
            expect(before).toEqual(after)
        })
    })

    it("should mark map as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = new Map([[1, 1]])
            const after = cloneMap(before)
            expect(isMutable(after)).toBe(true)
        })
    })

    it("should not clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = new Map([[1, 1]])
            markAsMutable(before)
            const after = cloneMap(before)
            expect(before).toBe(after)
        })
    })

    it("should clone outside mutation contexts", () => {
        const before = new Map([[1, 1]])
        const after = cloneMap(before)
        expect(before).not.toBe(after)
        expect(before).toEqual(after)
    })
})
