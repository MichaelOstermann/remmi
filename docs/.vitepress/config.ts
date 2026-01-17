import { defineConfig } from "vitepress"
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons"

export default defineConfig({
    base: "/remmi/",
    description: "Reverse immer.",
    title: "remmi",
    markdown: {
        theme: {
            dark: "catppuccin-macchiato",
            light: "github-light-default",
        },
        config(md) {
            md.use(groupIconMdPlugin)
        },
    },
    themeConfig: {
        aside: false,
        outline: "deep",
        docFooter: {
            next: false,
            prev: false,
        },
        search: {
            provider: "local",
        },
        sidebar: [
            {
                base: "/Remmi/",
                text: "Remmi",
                items: [
                    { link: "startMutations", text: "startMutations" },
                    { link: "endMutations", text: "endMutations" },
                    { link: "pauseMutations", text: "pauseMutations" },
                    { link: "withMutations", text: "withMutations" },
                    { link: "isMutating", text: "isMutating" },
                    { link: "isImmutable", text: "isImmutable" },
                    { link: "markAsMutable", text: "markAsMutable" },
                    { link: "markAsImmutable", text: "markAsImmutable" },
                    { link: "cloneObject", text: "cloneObject" },
                    { link: "cloneArray", text: "cloneArray" },
                    { link: "cloneMap", text: "cloneMap" },
                    { link: "cloneSet", text: "cloneSet" },
                ],
            },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/MichaelOstermann/remmi" },
        ],
    },
    vite: {
        plugins: [
            groupIconVitePlugin(),
        ],
    },
})
