import { describe, expect, it } from "vitest"
import { cloneObject, isMutable, markAsMutable, withMutations } from "../src/index"

describe("cloneObject", () => {
    it("should clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = { key: 0 }
            const after = cloneObject(before)
            expect(before).not.toBe(after)
            expect(before).toEqual(after)
        })
    })

    it("should mark object as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = { key: 0 }
            const after = cloneObject(before)
            expect(isMutable(after)).toBe(true)
        })
    })

    it("should not clone inside mutation contexts when marked as mutable", () => {
        expect.hasAssertions()
        withMutations(() => {
            const before = { key: 0 }
            markAsMutable(before)
            const after = cloneObject(before)
            expect(before).toBe(after)
        })
    })

    it("should clone outside mutation contexts", () => {
        const before = { key: 0 }
        const after = cloneObject(before)
        expect(before).not.toBe(after)
        expect(before).toEqual(after)
    })
})
