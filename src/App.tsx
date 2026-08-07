import { Footer } from './components/Footer'
import { MobileActions } from './components/MobileActions'
import { Nav } from './components/Nav'
import { ui, type PageKey } from './data/content'
import { resolvePageKey } from './routes'
import { AboutPage } from './pages/AboutPage'
import { CoachesPage } from './pages/CoachesPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

const pageComponents: Record<PageKey, () => React.JSX.Element> = {
  home: HomePage,
  about: AboutPage,
  coaches: CoachesPage,
  contact: ContactPage,
  notFound: NotFoundPage,
}

export default function App({ pathname = '/' }: { pathname?: string }) {
  const pageKey = resolvePageKey(pathname)
  const Page = pageComponents[pageKey]

  return (
    <>
      <a href="#main" className="absolute -top-16 left-[var(--gutter)] z-100 bg-accent px-4 py-2.5 font-body text-[0.74rem] tracking-[0.08em] text-on-accent uppercase no-underline transition-[top] focus-visible:top-4">
        {ui.skipToContent}
      </a>
      <Nav pathname={pathname} />
      <main id="main"><Page /></main>
      <Footer />
      <MobileActions />
    </>
  )
}
