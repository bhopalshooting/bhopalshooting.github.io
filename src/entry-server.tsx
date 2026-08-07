import { renderToString } from 'react-dom/server'
import App from './App'
import { machineReadable, pages, site, type PageMeta } from './data/content'
import { getStructuredData } from './data/schema'
import { redirects, resolvePageKey, routeKeys } from './routes'

export function render(pathname: string) {
  return renderToString(<App pathname={pathname} />)
}

export function getPageMeta(pathname: string): PageMeta {
  return pages[resolvePageKey(pathname)]
}

export function getRoutes() {
  return routeKeys.map((key) => pages[key])
}

export function getRedirects() {
  return redirects
}

export function getSiteContent() {
  return { machineReadable, site }
}

export { getStructuredData }
