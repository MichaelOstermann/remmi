import { defineConfig } from "vitepress"
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons"

export default defineConfig({
    title: "remmi",
    description: "Reverse immer.",
    base: "/remmi/",
    themeConfig: {
        outline: "deep",
        search: {
            provider: "local",
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/MichaelOstermann/remmi" },
        ],
        docFooter: {
            prev: false,
            next: false,
        },
    },
    markdown: {
        theme: {
            light: "github-light-default",
            dark: "catppuccin-macchiato",
        },
        config(md) {
            md.use(groupIconMdPlugin)
        },
    },
    vite: {
        plugins: [
            groupIconVitePlugin(),
        ],
    },
})
