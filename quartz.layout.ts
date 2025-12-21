import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { Options } from "./quartz/components/Explorer"

export const mapFn: Options["mapFn"] = (node) => {
  const folderNames = new Set(["blog"])
  if (node.isFolder && folderNames.has(node.displayName.toLowerCase())) {
    node.isFolder = false
  }
  return node
}
export const filterFn: Options["filterFn"] = (node) => {
  const isInsideFolder = !!node.data?.slug.startsWith("blog/")
  console.log('This is the node:', node)
  console.log('isInsideFolder:', isInsideFolder)
  console.log('node.isFolder:', node.isFolder)

  return !(isInsideFolder && !node.isFolder)
}


// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'andlogreg/digital-garden',
        repoId: 'R_kgDOQr8TXg',
        category: 'Announcements',
        categoryId: 'DIC_kwDOQr8TXs4C0DgO',
        lang: 'en',
        inputPosition: "top",
        mapping: "pathname",
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      "🔗 All My Links": "https://links.andlogreg.work",
      "RSS": "https://andlogreg.work/index.xml",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.MobileOnly(Component.Search()),
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.DesktopOnly(Component.Search()),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "Contents",
      filterFn,
      mapFn,
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.MobileOnly(Component.Search()),
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta()
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.DesktopOnly(Component.Search()),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "Contents",
      filterFn,
      mapFn,
    }),
  ],
  right: [],
}
