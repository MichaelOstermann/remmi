import { describe, expect, it } from "vitest"
import { endMutations, isMutating, startMutations } from "../src/index"

describe("endMutations", () => {
    it("should end mutation contexts", () => {
        startMutations()
        expect(isMutating()).toBe(true)
        endMutations()
        expect(isMutating()).toBe(false)
    })

    it("should be a no-op outside mutation contexts", () => {
        expect(isMutating()).toBe(false)
        endMutations()
        expect(isMutating()).toBe(false)
    })

    it("should require balanced calls to end nested contexts", () => {
        startMutations()
        startMutations()
        startMutations()
        expect(isMutating()).toBe(true)
        endMutations()
        expect(isMutating()).toBe(true)
        endMutations()
        expect(isMutating()).toBe(true)
        endMutations()
        expect(isMutating()).toBe(false)
    })
})
