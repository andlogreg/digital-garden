import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Andlogreg's Memory Leaks",
    pageTitleSuffix: "Where thoughts escape my mental RAM",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: 'google',
      tagId: 'G-17PLBLJR2S',
    },
    locale: "en-US",
    baseUrl: "andlogreg.work",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      // typography: {
      //   header: "Schibsted Grotesk",
      //   body: "Source Sans Pro",
      //   code: "IBM Plex Mono",
      // },
      // typography: {
      //   header: "Inter",          // Modern, clean headers
      //   body: "Crimson Pro",     // Classic, readable serif
      //   code: "Fira Code",
      // },
      typography: {
        header: "Schibsted Grotesk",       // Stylish, organic headers
        body: "Oxanium",          // Clean, friendly sans-serif
        code: "JetBrains Mono",
      },
      // colors: {
      //   lightMode: {
      //     light: "#fcfcfc",       // Brighter, paper-like white
      //     lightgray: "#efefef",
      //     gray: "#9e9e9e",
      //     darkgray: "#404040",
      //     dark: "#1a1a1a",        // Deep black for headers
      //     secondary: "#154c7e",   // Traditional "Oxford" Blue
      //     tertiary: "#8e9aaf",
      //     highlight: "rgba(21, 76, 126, 0.08)",
      //     textHighlight: "#fff23688",
      //   },
      //   darkMode: {
      //     light: "#121212",
      //     lightgray: "#2a2a2a",
      //     gray: "#737373",
      //     darkgray: "#d4d4d4",
      //     dark: "#ffffff",
      //     secondary: "#6ea5d8",   // Lighter blue for dark mode
      //     tertiary: "#8e9aaf",
      //     highlight: "rgba(110, 165, 216, 0.15)",
      //     textHighlight: "#b3aa0288",
      //   },
      // },

      colors: {
        lightMode: {
          light: "#fdf6e3",       // Solarized cream
          lightgray: "#eee8d5",
          gray: "#93a1a1",
          darkgray: "#586e75",
          dark: "#073642",
          secondary: "#2d6a4f",   // Deep forest green
          tertiary: "#b58900",    // Earthy gold
          highlight: "rgba(45, 106, 79, 0.1)",
          textHighlight: "#f9e07688",
        },
        darkMode: {
          light: "#002b36",       // Solarized deep teal
          lightgray: "#073642",
          gray: "#839496",
          darkgray: "#93a1a1",
          dark: "#eee8d5",
          secondary: "#52b788",   // Minty forest green
          tertiary: "#d33682",    // Muted magenta
          highlight: "rgba(82, 183, 136, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },

      // colors: {
      //   lightMode: {
      //     light: "#faf8f8",
      //     lightgray: "#e5e5e5",
      //     gray: "#b8b8b8",
      //     darkgray: "#4e4e4e",
      //     dark: "#2b2b2b",
      //     secondary: "#284b63",
      //     tertiary: "#84a59d",
      //     highlight: "rgba(143, 159, 169, 0.15)",
      //     textHighlight: "#fff23688",
      //   },
      //   darkMode: {
      //     light: "#161618",
      //     lightgray: "#393639",
      //     gray: "#646464",
      //     darkgray: "#d4d4d4",
      //     dark: "#ebebec",
      //     secondary: "#7b97aa",
      //     tertiary: "#84a59d",
      //     highlight: "rgba(143, 159, 169, 0.15)",
      //     textHighlight: "#b3aa0288",
      //   },
      // },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts(), Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssLimit: 50,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
