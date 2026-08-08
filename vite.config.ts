import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { documentMetadata, pages, site } from './src/data/content'

const metadataPlugin = (): Plugin => ({
  name: 'site-metadata',
  transformIndexHtml(html) {
    const page = pages.home
    const canonical = new URL(page.path, site.canonicalOrigin).toString()
    const image = new URL(page.image.src, site.canonicalOrigin).toString()
    const meta = (key: 'name' | 'property', value: string, content: string): HtmlTagDescriptor => ({
      tag: 'meta',
      attrs: { [key]: value, content },
      injectTo: 'head',
    })

    return {
      html: html.replace('<html>', `<html lang="${documentMetadata.language}">`),
      tags: [
        { tag: 'title', children: page.title, injectTo: 'head' },
        meta('name', 'theme-color', documentMetadata.themeColor),
        meta('name', 'description', page.description),
        meta('name', 'robots', page.index ? 'index,follow' : 'noindex,follow'),
        { tag: 'link', attrs: { rel: 'canonical', href: canonical }, injectTo: 'head' },
        meta('property', 'og:type', documentMetadata.openGraphType),
        meta('property', 'og:locale', documentMetadata.openGraphLocale),
        meta('property', 'og:site_name', site.name),
        meta('property', 'og:title', page.title),
        meta('property', 'og:description', page.description),
        meta('property', 'og:url', canonical),
        meta('property', 'og:image', image),
        meta('property', 'og:image:width', String(page.image.width)),
        meta('property', 'og:image:height', String(page.image.height)),
        meta('property', 'og:image:type', page.image.type),
        meta('property', 'og:image:alt', page.image.alt),
        meta('name', 'twitter:card', documentMetadata.twitterCard),
        meta('name', 'twitter:title', page.title),
        meta('name', 'twitter:description', page.description),
        meta('name', 'twitter:image', image),
      ],
    }
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), metadataPlugin()],
  // Binds to all interfaces: the app only ever runs in the devcontainer, and
  // localhost-only would not reach the host through the published port.
  server: {
    host: process.env.VITE_HOST ?? '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: process.env.VITE_HOST ?? '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
})
