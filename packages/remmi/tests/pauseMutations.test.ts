import { describe, expect, it } from "vitest"
import { isMutating, pauseMutations, withMutations } from "../src/index"

describe("pauseMutations", () => {
    it("should return output", () => {
        expect(pauseMutations(() => 1)).toBe(1)
    })

    it("should pause current mutation context and then resume", () => {
        expect.assertions(3)
        withMutations(() => {
            expect(isMutating()).toBe(true)
            pauseMutations(() => {
                expect(isMutating()).toBe(false)
            })
            expect(isMutating()).toBe(true)
        })
    })
})
