import { describe, expect, it } from "vitest"
import { isMutable, isMutating, markAsMutable, startMutations } from "../src/index.js"

describe("startMutations", () => {
    it("should return output", () => {
        expect(startMutations(() => 1)).toBe(1)
    })

    it("should create new mutation contexts", () => {
        expect.assertions(1)
        startMutations(() => {
            expect(isMutating()).toBe(true)
        })
    })

    it("should create nested mutation contexts", () => {
        expect.assertions(4)
        startMutations(() => {
            const value = [1]
            markAsMutable(value)
            expect(isMutable(value)).toBe(true)
            startMutations(() => {
                expect(isMutable(value)).toBe(false)
            })
            expect(isMutable(value)).toBe(true)
        })
        expect(isMutating()).toBe(false)
    })
})
