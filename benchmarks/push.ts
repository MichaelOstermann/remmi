import { tinybenchPrinter } from "@monstermann/tinybench-pretty-printer"
import { produce as immer } from "immer"
import { create as mutative } from "mutative"
import { Bench } from "tinybench"
import { cloneArray, withMutations } from "../packages/remmi/src/index.js"

function push<T>(target: T[], value: T): T[] {
    const copy = cloneArray(target)
    copy.push(value)
    return copy
}

const bench = new Bench()
const size = 10

bench
    .add("mutation", () => {
        const target: number[] = []
        for (let i = 0; i < size; i++)
            target.push(i)
        return target
    })
    .add("copy + mutation", () => {
        let target: number[] = []
        for (let i = 0; i < size; i++)
            target = [...target, i]
        return target
    })
    .add("**remmi (`withMutations`)**", () => {
        return withMutations(() => {
            let target: number[] = []
            for (let i = 0; i < size; i++)
                target = push(target, i)
            return target
        })
    })
    .add("**remmi**", () => {
        let target: number[] = []
        for (let i = 0; i < size; i++)
            target = push(target, i)
        return target
    })
    .add("immer", () => {
        const target: number[] = []
        return immer(target, (draft) => {
            for (let i = 0; i < size; i++)
                draft.push(i)
            return draft
        })
    })
    .add("mutative", () => {
        const target: number[] = []
        return mutative(target, (draft) => {
            for (let i = 0; i < size; i++)
                draft.push(i)
            return draft
        })
    })

bench
    .run()
    .then(() => tinybenchPrinter.summary({ method: "x" }).toMarkdown(bench))
    // eslint-disable-next-line no-console
    .then(console.log)
