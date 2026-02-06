import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Andlogreg's Notes",
    pageTitleSuffix: " -- Where thoughts escape my mental RAM",
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
      //     light: "#faf9f6",      // Off-white
      //     lightgray: "#e5e7eb",
      //     gray: "#9ca3af",
      //     darkgray: "#4b5563",
      //     dark: "#1f2937",
      //     secondary: "#587a6f",   // Muted Sage Green
      //     tertiary: "#84a98c",    // Soft Fern
      //     highlight: "rgba(88, 122, 111, 0.15)",
      //     textHighlight: "#fff23688",
      //   },
      //   darkMode: {
      //     light: "#1a1f1c",       // Deep forest black
      //     lightgray: "#2e3633",
      //     gray: "#889c96",
      //     darkgray: "#9da5a0",
      //     dark: "#c8d2ce",
      //     secondary: "#81b29a",   // Pastel Green
      //     tertiary: "#a3b18a",    // Muted Olive
      //     highlight: "rgba(129, 178, 154, 0.15)",
      //     textHighlight: "#b3aa0288",
      //   },
      // },

      colors: {
        lightMode: {
          light: "#faf9f6",      // Neutral off-white
          lightgray: "#e4e4e7",   // Crisp light gray
          gray: "#93a1a1",
          darkgray: "#586e75",
          dark: "#073642",
          secondary: "#2d6a4f",   // Deep forest green
          tertiary: "#b58900",    // Muted magenta (matching dark mode)
          highlight: "rgba(45, 106, 79, 0.1)",
          textHighlight: "#f9e07688",
        },
        darkMode: {
          light: "#161618",       // Neutral dark
          lightgray: "#393639",   // Dark gray
          gray: "#839496",
          darkgray: "#93a1a1",
          dark: "#ebebec",
          secondary: "#52b788",   // Minty forest green
          tertiary: "#b58900",    // Muted magenta
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
