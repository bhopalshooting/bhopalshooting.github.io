/*
 * Post-build smoke checks, run by `pnpm check`. The site is fully prerendered,
 * so dist is what visitors and crawlers actually receive; reading it back rather
 * than importing from src checks the artifact instead of its source.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, join, posix, resolve } from 'node:path'
import { parse } from 'node-html-parser'

const dist = resolve(process.cwd(), 'dist')

const failures = []
const fail = (where, message) => failures.push(`${where}: ${message}`)

async function walk(dir, base = '') {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = posix.join(base, entry.name)
    if (entry.isDirectory()) found.push(...(await walk(join(dir, entry.name), rel)))
    else found.push(rel)
  }
  return found
}

const built = await stat(dist).catch(() => null)
if (!built) throw new Error('dist is missing — run `pnpm build` first.')

const distFiles = new Set(await walk(dist))

/** The file dist serves for a site-absolute URL. */
function servedFile(pathname) {
  const clean = pathname.replace(/^\/+/, '').split(/[?#]/, 1)[0]
  return clean === '' || clean.endsWith('/') ? `${clean}index.html` : clean
}

const htmlFiles = [...distFiles].filter((file) => extname(file) === '.html').sort()
if (htmlFiles.length === 0) throw new Error('dist contains no HTML — run `pnpm build` first.')

const documents = new Map()
for (const file of htmlFiles) documents.set(file, parse(await readFile(join(dist, file), 'utf8')))

// Retired routes ship as meta-refresh stubs; they are pages for link-resolution
// purposes but are exempt from the metadata a real page must carry.
const isStub = (doc) => Boolean(doc.querySelector('meta[http-equiv="refresh"]'))
const pages = htmlFiles.filter((file) => !isStub(documents.get(file)))
const indexable = pages.filter((file) => file !== '404.html')

const home = documents.get('index.html')
if (!home) throw new Error('dist/index.html is missing — the prerender step did not run.')
const origin = new URL(home.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '').origin
const siteName = home.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
const pageUrl = (file) => new URL(`/${file.replace(/(^|\/)index\.html$/, '$1')}`, origin).toString()

// ---------------------------------------------------------------- page checks

const isExternal = (href) => /^(https?:|mailto:|tel:)/i.test(href)

/** Every URL a srcset-style attribute points at, without its width descriptor. */
const srcsetUrls = (value) =>
  (value ?? '')
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean)

for (const [file, doc] of documents) {
  // --- links
  for (const anchor of doc.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href')
    if (href.startsWith('#')) {
      if (!doc.querySelector(`[id="${href.slice(1)}"]`)) {
        fail(file, `in-page link ${href} has no matching id`)
      }
      continue
    }
    if (isExternal(href)) {
      if (anchor.getAttribute('target') === '_blank') {
        const rel = anchor.getAttribute('rel') ?? ''
        if (!/noreferrer|noopener/.test(rel)) {
          fail(file, `link to ${href} opens a new tab without rel=noreferrer`)
        }
      }
      continue
    }
    if (!href.startsWith('/')) {
      fail(file, `link ${href} is neither absolute nor site-rooted`)
      continue
    }
    if (!distFiles.has(servedFile(href))) fail(file, `link ${href} resolves to nothing in dist`)
  }

  // --- images and every srcset candidate
  for (const img of doc.querySelectorAll('img')) {
    if (img.getAttribute('alt') === undefined) {
      fail(file, `img ${img.getAttribute('src')} has no alt attribute`)
    }
    for (const candidate of [img.getAttribute('src'), ...srcsetUrls(img.getAttribute('srcset'))]) {
      if (!candidate || isExternal(candidate)) continue
      if (!distFiles.has(servedFile(candidate))) {
        fail(file, `image ${candidate} is referenced but not in dist`)
      }
    }
  }

  // --- stylesheets, icons, and the preloads React emits for eager images,
  // which carry their candidates on imageSrcSet rather than href
  for (const link of doc.querySelectorAll('link')) {
    if (link.getAttribute('rel') === 'canonical') continue
    const href = link.getAttribute('href')
    for (const candidate of [href, ...srcsetUrls(link.getAttribute('imagesrcset'))]) {
      if (!candidate?.startsWith('/')) continue
      if (!distFiles.has(servedFile(candidate))) fail(file, `<link> ${candidate} is not in dist`)
    }
  }

  // --- controls need an accessible name
  for (const button of doc.querySelectorAll('button')) {
    if (!(button.getAttribute('aria-label') ?? button.textContent.trim())) {
      fail(file, 'a <button> has no accessible name')
    }
  }
  for (const anchor of doc.querySelectorAll('a')) {
    const name = anchor.getAttribute('aria-label') ?? anchor.textContent.trim()
    if (!name && !anchor.querySelector('img[alt]:not([alt=""])')) {
      fail(file, `link to ${anchor.getAttribute('href')} has no accessible name`)
    }
  }
  for (const control of doc.querySelectorAll('input, select, textarea')) {
    const id = control.getAttribute('id')
    const named =
      control.getAttribute('aria-label') ||
      control.getAttribute('aria-labelledby') ||
      control.closest('label') ||
      (id && doc.querySelector(`label[for="${id}"]`))
    if (!named) fail(file, `form control "${control.getAttribute('name')}" has no label`)
  }

  if (isStub(doc)) continue

  // --- document metadata
  if (!doc.querySelector('html')?.getAttribute('lang')) fail(file, '<html> has no lang')
  if (!doc.querySelector('title')?.textContent.trim()) fail(file, 'no <title>')

  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')
  if (!description) fail(file, 'no meta description')
  else if (description.length > 165) fail(file, `meta description is ${description.length} chars`)

  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href')
  if (!canonical) fail(file, 'no canonical link')
  // 404.html is served for any unmatched path, so it has no address to point at.
  else if (indexable.includes(file) && canonical !== pageUrl(file)) {
    fail(file, `canonical ${canonical} does not match where the page is served`)
  }

  for (const property of [
    'og:type',
    'og:locale',
    'og:site_name',
    'og:title',
    'og:description',
    'og:url',
    'og:image',
    'og:image:width',
    'og:image:height',
    'og:image:type',
    'og:image:alt',
  ]) {
    if (!doc.querySelector(`meta[property="${property}"]`)?.getAttribute('content')) {
      fail(file, `no ${property}`)
    }
  }
  for (const name of ['theme-color', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content')) fail(file, `no ${name}`)
  }

  const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? ''
  if (indexable.includes(file) && !robots.includes('index,follow')) fail(file, `robots is "${robots}"`)
  if (!indexable.includes(file) && !robots.includes('noindex')) {
    fail(file, `robots should be noindex, is "${robots}"`)
  }

  // --- structured data
  const jsonld = doc.querySelector('script[type="application/ld+json"]')?.textContent
  if (!jsonld) fail(file, 'no JSON-LD')
  else {
    try {
      const graph = JSON.parse(jsonld)['@graph']
      if (!Array.isArray(graph) || graph.length === 0) fail(file, 'JSON-LD @graph is empty')
    } catch (error) {
      fail(file, `JSON-LD does not parse: ${error.message}`)
    }
  }

  // --- headings
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const h1s = headings.filter((node) => node.rawTagName === 'h1')
  if (h1s.length !== 1) fail(file, `expected 1 <h1>, found ${h1s.length}`)
  let previous = 0
  for (const heading of headings) {
    const level = Number(heading.rawTagName.slice(1))
    if (previous && level > previous + 1) {
      fail(file, `heading jumps from h${previous} to h${level} ("${heading.textContent.trim().slice(0, 40)}")`)
    }
    previous = level
  }

  // --- responsive invariants: the layout is fluid, so anything pinning a width
  // in px wider than the narrowest supported viewport will overflow it.
  const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? ''
  if (!viewport.includes('width=device-width')) fail(file, 'viewport meta is not device-width')

  for (const node of doc.querySelectorAll('[style]')) {
    const width = /(?:^|;)\s*(?:min-)?width\s*:\s*(\d+)px/.exec(node.getAttribute('style'))
    if (width && Number(width[1]) > 320) {
      fail(file, `inline style pins width to ${width[1]}px, wider than a 320px viewport`)
    }
  }
  for (const node of doc.querySelectorAll('[class]')) {
    for (const [, value] of node.getAttribute('class').matchAll(/(?:^|\s)min-w-\[(\d+)px\]/g)) {
      if (Number(value) > 320) fail(file, `min-w-[${value}px] cannot fit a 320px viewport`)
    }
  }
}

// ------------------------------------------------------------ site-wide files

const sitemap = distFiles.has('sitemap.xml') ? await readFile(join(dist, 'sitemap.xml'), 'utf8') : ''
if (!sitemap) fail('sitemap.xml', 'was not generated')
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url)
for (const file of indexable) {
  if (!listed.includes(pageUrl(file))) fail('sitemap.xml', `is missing ${pageUrl(file)}`)
}
for (const url of listed) {
  const target = servedFile(new URL(url).pathname)
  if (!indexable.includes(target)) fail('sitemap.xml', `lists ${url}, which is not an indexable page`)
}

const robotsTxt = distFiles.has('robots.txt') ? await readFile(join(dist, 'robots.txt'), 'utf8') : ''
if (!robotsTxt) fail('robots.txt', 'was not shipped')
else if (!robotsTxt.includes(`${origin}/sitemap.xml`)) {
  fail('robots.txt', `does not point at ${origin}/sitemap.xml`)
}

const cname = distFiles.has('CNAME') ? (await readFile(join(dist, 'CNAME'), 'utf8')).trim() : ''
if (cname !== new URL(origin).hostname) {
  fail('CNAME', `is "${cname}", expected "${new URL(origin).hostname}"`)
}

if (!distFiles.has('site.webmanifest')) fail('site.webmanifest', 'was not shipped')
else {
  const manifest = JSON.parse(await readFile(join(dist, 'site.webmanifest'), 'utf8'))
  for (const icon of manifest.icons ?? []) {
    if (!distFiles.has(servedFile(icon.src))) fail('site.webmanifest', `icon ${icon.src} is not in dist`)
  }
  if (manifest.name !== siteName) {
    fail('site.webmanifest', `name is "${manifest.name}", but og:site_name is "${siteName}"`)
  }
  const themeColor = home.querySelector('meta[name="theme-color"]')?.getAttribute('content')
  if (manifest.theme_color !== themeColor || manifest.background_color !== themeColor) {
    fail('site.webmanifest', 'theme colours do not match the document metadata')
  }
}

if (!distFiles.has('llms.txt')) fail('llms.txt', 'was not generated')

// ------------------------------------------------------------- orphaned assets

const referenced = new Set()
for (const doc of documents.values()) {
  for (const node of doc.querySelectorAll('img, a[href], link, script[src]')) {
    const values = [
      node.getAttribute('src'),
      node.getAttribute('href'),
      ...srcsetUrls(node.getAttribute('srcset')),
      ...srcsetUrls(node.getAttribute('imagesrcset')),
    ]
    for (const value of values) if (value?.startsWith('/')) referenced.add(servedFile(value))
  }
}
// The italic face is only ever named in an @font-face rule, never preloaded.
for (const file of distFiles) {
  if (extname(file) !== '.css') continue
  const css = await readFile(join(dist, file), 'utf8')
  for (const [, value] of css.matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) {
    referenced.add(servedFile(value))
  }
}

const mediaExtensions = new Set(['.webp', '.jpg', '.jpeg', '.png', '.svg', '.woff2'])
for (const file of distFiles) {
  if (!mediaExtensions.has(extname(file))) continue
  // Icons and the social image are fetched by crawlers and app shells rather
  // than linked from the markup.
  if (/^(icons\/|apple-touch-icon|og-image|favicon)/.test(file)) continue
  if (!referenced.has(file)) fail(file, 'is shipped but nothing references it')
}

// ------------------------------------------------------------------- reporting

if (failures.length) {
  console.error(`\n${failures.length} problem${failures.length === 1 ? '' : 's'} found:\n`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  console.error('')
  process.exit(1)
}

console.log(
  `✓ ${pages.length} pages, ${htmlFiles.length - pages.length} redirect stubs, ` +
    `${referenced.size} assets, sitemap, robots and manifest all check out`,
)
