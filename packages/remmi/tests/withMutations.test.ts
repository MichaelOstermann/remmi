import { describe, expect, it } from "vitest"
import { isMutable, isMutating, markAsMutable, withMutations } from "../src/index"

describe("withMutations", () => {
    it("should return output", () => {
        expect(withMutations(() => 1)).toBe(1)
    })

    it("should create new mutation contexts", () => {
        expect.assertions(2)
        withMutations(() => {
            expect(isMutating()).toBe(true)
        })
        expect(isMutating()).toBe(false)
    })

    it("should reuse mutation contexts", () => {
        expect.assertions(4)
        withMutations(() => {
            const value = [1]
            markAsMutable(value)
            expect(isMutable(value)).toBe(true)
            withMutations(() => {
                expect(isMutable(value)).toBe(true)
            })
            expect(isMutable(value)).toBe(true)
        })
        expect(isMutating()).toBe(false)
    })
})
