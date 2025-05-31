import { describe, expect, it } from "vitest"
import { isMutating, startMutations } from "../src/index.js"

describe("isMutating", () => {
    it("should return true inside mutation contexts", () => {
        expect.hasAssertions()
        startMutations(() => {
            expect(isMutating()).toBe(true)
        })
    })

    it("should return false outside mutation contexts", () => {
        expect(isMutating()).toBe(false)
    })
})
