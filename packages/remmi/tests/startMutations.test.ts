import { describe, expect, it } from "vitest"
import { endMutations, isMutable, isMutating, markAsMutable, startMutations } from "../src/index"

describe("startMutations", () => {
    it("should create mutation contexts", () => {
        expect(isMutating()).toBe(false)
        startMutations()
        expect(isMutating()).toBe(true)
        endMutations()
        expect(isMutating()).toBe(false)
    })

    it("should reuse mutation contexts", () => {
        startMutations()
        const value = [1]
        markAsMutable(value)
        expect(isMutable(value)).toBe(true)
        startMutations()
        expect(isMutable(value)).toBe(true)
        endMutations()
        expect(isMutable(value)).toBe(true)
        endMutations()
        expect(isMutating()).toBe(false)
    })
})
