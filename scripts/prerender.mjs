import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = resolve(root, 'dist')
const templatePath = resolve(dist, 'index.html')
const serverEntry = resolve(root, 'dist-ssr/entry-server.js')
const { getPageMeta, getRedirects, getRoutes, getSiteContent, getStructuredData, render } = await import(pathToFileURL(serverEntry).href)
const template = await readFile(templatePath, 'utf8')
const {
  documentMetadata,
  machineReadable,
  redirectDocument,
  site,
} = getSiteContent()
const origin = site.canonicalOrigin

const escapeAttribute = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function replaceMeta(html, attribute, key, value) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i')
  return html.replace(pattern, `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`)
}

function renderDocument(pathname) {
  const meta = getPageMeta(pathname)
  const canonical = new URL(meta.path, origin).toString()
  const image = new URL(meta.image.src, origin).toString()
  const schema = JSON.stringify(getStructuredData(pathname)).replaceAll('<', '\\u003c')
  let html = template
    .replace(/<html\s+lang="[^"]*"/i, `<html lang="${escapeAttribute(documentMetadata.language)}"`)
    .replace(/<title>.*?<\/title>/s, `<title>${escapeAttribute(meta.title)}</title>`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace('<!--app-jsonld-->', `<script type="application/ld+json">${schema}</script>`)
    .replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`)

  html = replaceMeta(html, 'name', 'theme-color', documentMetadata.themeColor)
  html = replaceMeta(html, 'name', 'description', meta.description)
  html = replaceMeta(html, 'name', 'robots', meta.index ? 'index,follow' : 'noindex,follow')
  html = replaceMeta(html, 'property', 'og:type', documentMetadata.openGraphType)
  html = replaceMeta(html, 'property', 'og:locale', documentMetadata.openGraphLocale)
  html = replaceMeta(html, 'property', 'og:site_name', site.name)
  html = replaceMeta(html, 'property', 'og:title', meta.title)
  html = replaceMeta(html, 'property', 'og:description', meta.description)
  html = replaceMeta(html, 'property', 'og:url', canonical)
  html = replaceMeta(html, 'property', 'og:image', image)
  html = replaceMeta(html, 'property', 'og:image:width', meta.image.width)
  html = replaceMeta(html, 'property', 'og:image:height', meta.image.height)
  html = replaceMeta(html, 'property', 'og:image:type', meta.image.type)
  html = replaceMeta(html, 'property', 'og:image:alt', meta.image.alt)
  html = replaceMeta(html, 'name', 'twitter:card', documentMetadata.twitterCard)
  html = replaceMeta(html, 'name', 'twitter:title', meta.title)
  html = replaceMeta(html, 'name', 'twitter:description', meta.description)
  html = replaceMeta(html, 'name', 'twitter:image', image)
  return html
}

const routes = getRoutes()
for (const route of routes) {
  const output = route.path === '/' ? templatePath : resolve(dist, `.${route.path}`, 'index.html')
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, renderDocument(route.path))
}

await writeFile(resolve(dist, '404.html'), renderDocument('/404/'))

// Static hosts have no rewrite rules, so retired URLs ship as meta-refresh stubs
// with a canonical pointing at the replacement.
for (const [from, to] of Object.entries(getRedirects())) {
  const target = new URL(to, origin).toString()
  const output = resolve(dist, `.${from}`, 'index.html')
  await mkdir(dirname(output), { recursive: true })
  await writeFile(
    output,
    `<!doctype html>
<html lang="${escapeAttribute(documentMetadata.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <title>${escapeAttribute(redirectDocument.title)} | ${escapeAttribute(site.name)}</title>
  </head>
  <body><p>${escapeAttribute(redirectDocument.message)} <a href="${target}">${target}</a>.</p></body>
</html>
`,
  )
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${new URL(route.path, origin)}</loc></url>`).join('\n')}
</urlset>
`
await writeFile(resolve(dist, 'sitemap.xml'), sitemap)

const llms = `# ${site.name}

> ${machineReadable.summary}

- ${machineReadable.addressLabel}: ${site.address.lines.join(', ')}
- ${machineReadable.phoneLabel}: ${site.phoneDisplay}
- ${machineReadable.hoursLabel}: ${site.hours}
- ${machineReadable.coachLabel}: ${machineReadable.coachName}

## Main pages

${routes.map((route) => `- [${route.title}](${new URL(route.path, origin)}): ${route.description}`).join('\n')}

## ${machineReadable.notesTitle}

${machineReadable.notes.map((note) => `- ${note}`).join('\n')}
`
await writeFile(resolve(dist, 'llms.txt'), llms)
await rm(resolve(root, 'dist-ssr'), { recursive: true })
