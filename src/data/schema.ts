import {
  coaches,
  disciplines,
  headCoach,
  home,
  navigation,
  pages,
  publicResearchSources,
  site,
} from './content'
import { resolvePageKey } from '../routes'

const origin = site.canonicalOrigin
const absolute = (path: string) => new URL(path, origin).toString()

const academy = {
  '@type': ['SportsActivityLocation', 'LocalBusiness'],
  '@id': `${origin}/#academy`,
  name: site.name,
  description: pages.home.description,
  url: origin,
  telephone: `+${site.whatsappNumber}`,
  foundingDate: site.established,
  sameAs: [
    site.instagram.href,
    site.facebook.href,
    site.alternateOrigin,
    publicResearchSources.businessProfile,
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: site.openingHours.dayOfWeek,
    opens: site.openingHours.opens,
    closes: site.openingHours.closes,
  },
  sport: site.sports,
}

const rishi = {
  '@type': 'Person',
  '@id': `${origin}/coaches/#rishi-soni`,
  name: headCoach.name,
  jobTitle: headCoach.jobTitle,
  url: absolute(pages.coaches.path),
  worksFor: { '@id': `${origin}/#academy` },
  knowsAbout: disciplines.map((item) => item.name),
  hasCredential: coaches.credentials.documents.map((document) => ({
    '@type': 'EducationalOccupationalCredential',
    name: document.title,
    credentialCategory: document.issuer,
  })),
}

function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function getStructuredData(pathname: string) {
  const key = resolvePageKey(pathname)
  const meta = pages[key]
  const canonical = absolute(meta.path)
  const homeBreadcrumbName = navigation.find((item) => item.href === pages.home.path)?.label
  const breadcrumbName = navigation.find((item) => item.href === meta.path)?.label
  const graph: Record<string, unknown>[] = [
    academy,
    {
      '@type': key === 'about' ? 'AboutPage' : key === 'contact' ? 'ContactPage' : 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': `${origin}/#website` },
      about: key === 'coaches' ? { '@id': `${origin}/coaches/#rishi-soni` } : { '@id': `${origin}/#academy` },
    },
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: origin,
      name: site.name,
      publisher: { '@id': `${origin}/#academy` },
    },
  ]

  if (key === 'coaches' || key === 'home' || key === 'about') graph.push(rishi)
  if (key === 'home') graph.push(faqSchema(home.faq.items))

  if (meta.path !== '/' && key !== 'notFound') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: absolute(pages.home.path) },
        { '@type': 'ListItem', position: 2, name: breadcrumbName, item: canonical },
      ],
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
