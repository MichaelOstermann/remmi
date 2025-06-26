import { tinybenchPrinter } from "@monstermann/tinybench-pretty-printer"
import { produce as immer } from "immer"
import { create as mutative } from "mutative"
import { Bench } from "tinybench"
import { cloneArray, withMutations } from "../packages/remmi/src/index"

function replace<T>(target: T[], value: T, replacement: T): T[] {
    if (value === replacement) return target
    const idx = target.indexOf(value)
    if (idx === -1) return target
    const result = cloneArray(target)
    result.splice(idx, 1, replacement)
    return result
}

const bench = new Bench()

const createTarget = () => Array.from({ length: 10_000 }, (_, i) => i)

const values = Array.from({ length: 1_000 }, (_, i) => i)

bench
    .add("mutation", () => {
        const target = createTarget()
        for (const value of values) {
            const idx = target.indexOf(value)
            target.splice(idx, 1, -1)
        }
        return target
    })
    .add("copy + mutation", () => {
        let target = createTarget()
        for (const pred of values) {
            const idx = target.indexOf(pred)
            target = [...target]
            target.splice(idx, 1, -1)
        }
        return target
    })
    .add("**remmi (`withMutations`)**", () => {
        return withMutations(() => {
            let target = createTarget()
            for (const pred of values)
                target = replace(target, pred, -1)
            return target
        })
    })
    .add("**remmi**", () => {
        let target = createTarget()
        for (const pred of values)
            target = replace(target, pred, -1)
        return target
    })
    .add("immer", () => {
        const target = createTarget()
        return immer(target, (draft) => {
            for (const pred of values) {
                const idx = draft.indexOf(pred)
                draft.splice(idx, 1, -1)
            }
            return draft
        })
    })
    .add("mutative", () => {
        const target = createTarget()
        return mutative(target, (draft) => {
            for (const pred of values) {
                const idx = draft.indexOf(pred)
                draft.splice(idx, 1, -1)
            }
            return draft
        })
    })

bench
    .run()
    .then(() => tinybenchPrinter.summary({ method: "x" }).toMarkdown(bench))

    .then(console.log)
