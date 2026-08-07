import { pages, type PageKey } from './data/content'

export const routeKeys: Exclude<PageKey, 'notFound'>[] = [
  'home',
  'about',
  'coaches',
  'contact',
]

/**
 * Paths the site used to publish. They are prerendered as redirect stubs so the
 * links already indexed by search engines and shared on WhatsApp keep working.
 */
export const redirects: Record<string, string> = {
  '/training/': '/',
  '/range/': '/about/',
  '/coach/rishi-soni/': '/coaches/',
}

export function normalizePath(pathname: string) {
  const clean = pathname.split(/[?#]/, 1)[0] || '/'
  if (clean === '/') return clean
  return `/${clean.replace(/^\/+|\/+$/g, '')}/`
}

export function resolvePageKey(pathname: string): PageKey {
  const normalized = normalizePath(pathname)
  return routeKeys.find((key) => pages[key].path === normalized) ?? 'notFound'
}
