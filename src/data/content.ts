export type PageKey = 'home' | 'about' | 'coaches' | 'contact' | 'notFound'

export type ImageAsset = {
  src: string
  srcSet: string
  alt: string
  width: number
  height: number
}

export type CredentialAsset = {
  image: ImageAsset
  title: string
  issuer: string
  detail: string
  href: string
  hrefLabel: string
}

export type SocialImageAsset = {
  src: string
  width: number
  height: number
  type: string
  alt: string
}

const photoWidths = [480, 768, 1200, 1800]

const photo = (
  name: string,
  width: number,
  height: number,
  alt: string,
  widths = photoWidths,
): ImageAsset => ({
  src: `/photos/${name}-${widths.filter((w) => w <= 1200).at(-1)}.webp`,
  srcSet: widths.map((w) => `/photos/${name}-${w}.webp ${w}w`).join(', '),
  alt,
  width,
  height,
})

const credentialWidths = [640, 1600]

const credential = (name: string, alt: string): ImageAsset => ({
  src: `/credentials/${name}-640.webp`,
  srcSet: credentialWidths.map((w) => `/credentials/${name}-${w}.webp ${w}w`).join(', '),
  alt,
  width: 640,
  height: 453,
})

export type PageMeta = {
  path: string
  title: string
  description: string
  image: SocialImageAsset
  index: boolean
}

export const headCoach = {
  name: 'Rishi Soni',
  jobTitle: 'Head Pistol Shooting Coach',
}

// CLIENT-APPROVED — brand, location, offering and primary contact route.
// PUBLICLY-VERIFIED — phone, address, hours, rating and establishment year are
// corroborated by the academy's own Instagram profile and business directories.
export const site = {
  name: 'Bhopal Shooting Range',
  descriptor: 'Pistol & Rifle Shooting Academy',
  locationShort: 'Bairagarh, Bhopal',
  location: 'Bhopal, Madhya Pradesh',
  canonicalOrigin: 'https://bhopalshooting.com',
  alternateOrigin: 'https://bhopalshootingrange.com',
  whatsappNumber: '917869139088',
  phoneDisplay: '+91 78691 39088',
  established: '2021',
  instagram: { handle: '@bhopalshootingrange', href: 'https://www.instagram.com/bhopalshootingrange/' },
  facebook: { handle: '/bhopalshootingrange', href: 'https://www.facebook.com/bhopalshootingrange/' },
  hours: 'Open daily · 5:00 am to 11:00 pm',
  openingHours: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '05:00',
    closes: '23:00',
  },
  directions: 'https://www.google.com/maps/search/?api=1&query=Bhopal+Shooting+Range+Bairagarh',
  address: {
    lines: ['52 T Ward, opposite the TVS showroom', 'Dr Kurian Road, Bairagarh', 'Bhopal, Madhya Pradesh 462030'],
    street: '52 T Ward, Dr Kurian Road, Bairagarh',
    locality: 'Bhopal',
    region: 'Madhya Pradesh',
    postalCode: '462030',
    country: 'IN',
  },
  sports: ['10m Air Pistol', '25m Pistol', '50m Pistol', '10 Meter Air Rifle', '50m Rifle 3 Positions'],
}

const socialImage: SocialImageAsset = {
  src: '/og-image.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: `Pistol and rifle shooters training at ${site.name} in Bairagarh`,
}

export const documentMetadata = {
  language: 'en-IN',
  themeColor: '#0e0f11',
  openGraphLocale: 'en_IN',
  openGraphType: 'website',
  twitterCard: 'summary_large_image',
}

export const redirectDocument = {
  title: 'Moved',
  message: 'This page has moved to',
}

// Evidence for the claims on the site. Only the business profile is linked from
// the page; the rest is provenance for the credential items open in TODO.md.
export const publicResearchSources = {
  businessProfile:
    'https://www.justdial.com/Bhopal/Bhopal-Shooting-Range-Infront-Of-Tvs-Showroom-Bairagarh/0755PX755-X755-220205123007-W1Y1_BZDET',
  instagram: site.instagram.href,
  nrai2022: 'https://www.thenrai.in/PDF/cacd0192-049a-449f-aff2-aa952cb4841e.pdf',
  nrai2023: 'https://www.thenrai.in/PDF/65a2312a-744a-4d47-8544-83f8f9a9ec80.pdf',
  nrai2025: 'https://www.thenrai.in/PDF/e4ff60ad-70be-484c-8cea-a77bd3503e55.pdf',
  nrai2026: 'https://www.thenrai.in/PDF/8f5dd6bb-b947-42c0-b2cf-b3eb53b6a485.pdf',
}

export const ui = {
  skipToContent: 'Skip to content',
  homeLabel: `${site.name} home`,
  mainNavigationLabel: 'Main navigation',
  footerNavigationLabel: 'Footer navigation',
  contactActionsLabel: 'Contact actions',
  disciplinesLabel: 'Pistol and rifle disciplines coached at the range',
  disciplinesPrevious: 'Show previous disciplines',
  disciplinesNext: 'Show more disciplines',
  disciplinesHint: 'Use the arrows or swipe to see every discipline.',
  menuOpen: 'Menu',
  menuClose: 'Close',
  switchToDark: 'Switch to dark theme',
  switchToLight: 'Switch to light theme',
  call: 'Call',
}

const trialMessageText = `Hi, I'd like to book a trial session at ${site.name}.`
const trialMessage = encodeURIComponent(trialMessageText)

export const primaryCta = {
  label: 'Book a trial',
  href: `https://wa.me/${site.whatsappNumber}?text=${trialMessage}`,
}

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Coaches', href: '/coaches/' },
  { label: 'Contact', href: '/contact/' },
]

export const pages: Record<PageKey, PageMeta> = {
  home: {
    path: '/',
    title: `${site.name} | Pistol & Rifle Coaching in Bhopal`,
    description:
      `Pistol and rifle shooting academy in Bairagarh, Bhopal. Train with ISSF-certified coach ${headCoach.name}, an active national and Indian team squad trials competitor.`,
    image: socialImage,
    index: true,
  },
  about: {
    path: '/about/',
    title: `About the Range | ${site.name}, Bairagarh`,
    description:
      'A pistol and rifle shooting range in Bairagarh, Bhopal, open daily since 2021. See the firing line, the disciplines coached and how to visit.',
    image: socialImage,
    index: true,
  },
  coaches: {
    path: '/coaches/',
    title: `Our Coaches | ${headCoach.name}, ISSF-Certified Pistol Coach in Bhopal`,
    description:
      `${headCoach.name} is the head pistol coach at ${site.name} — ISSF-certified, NIS Patiala Grade A, and an active national competitor in 10m, 25m and 50m pistol.`,
    image: socialImage,
    index: true,
  },
  contact: {
    path: '/contact/',
    title: `Book a Trial | ${site.name}, Bairagarh`,
    description:
      `Book a pistol or rifle trial session at ${site.name} in Bairagarh, Bhopal. Message on WhatsApp or call ${site.phoneDisplay}.`,
    image: socialImage,
    index: true,
  },
  notFound: {
    path: '/404/',
    title: `Page Not Found | ${site.name}`,
    description: 'The requested page could not be found.',
    image: socialImage,
    index: false,
  },
}

/*
 * Portrait assets are cropped to 4:5 in the file itself, composed on the subject,
 * so object-fit has almost nothing left to do. There is deliberately no
 * object-position hook: a badly framed shot gets re-cut, not nudged in CSS.
 */
const photos = {
  firingPoint: photo(
    'air-pistol-firing-line',
    1200,
    1500,
    'A shooter steadying an air pistol on the firing point, with the lit 10m targets down the lane behind',
  ),
  targets: photo(
    'electronic-targets',
    1200,
    800,
    'Electronic scoring unit and paper targets along the 10m firing line at Bhopal Shooting Range',
  ),
  outdoorRange: photo(
    '50m-shooting-range',
    1200,
    1500,
    'View from the firing points down the outdoor target range as athletes prepare their stations',
  ),
  twentyFiveMetreAthlete: photo(
    '25m-pistol-duelling-1',
    1200,
    1500,
    'A pistol athlete aiming at a 25m target during competition',
  ),
  twentyFiveMetrePistol: photo(
    '25m-pistol-duelling-2',
    1200,
    1500,
    'A sport pistol resting on a firing-point towel beside the 25m range',
  ),
  fiftyMetreRifle: photo(
    '50m-rifle-3-positions',
    1200,
    1500,
    'A rifle athlete in a shooting jacket aiming from the 50m firing point toward the outdoor targets',
  ),
  freePistol: photo(
    '50m-free-pistol',
    1200,
    1500,
    'A 50m free pistol with its fitted wooden grip beside its case on the firing bench',
  ),
  firingLineWide: photo(
    'firing-line-wide',
    1200,
    625,
    'Shooters training side by side along the firing line at Bhopal Shooting Range',
  ),
  pistolSquad: photo(
    'pistol-squad-training',
    1200,
    1500,
    'Three athletes training together on 10m air pistol at Bhopal Shooting Range',
  ),
  rifleAthletes: photo(
    'rifle-athletes',
    1200,
    1500,
    'Two young athletes in shooting jackets at their 10m air rifle stations',
  ),
  rishiShooting: photo(
    'rishi-soni-shooting',
    1200,
    1500,
    'Pistol coach Rishi Soni holding an air pistol at full extension on the firing line',
  ),
  rishiWithAthlete: photo(
    'rishi-soni-with-athlete',
    768,
    960,
    'Rishi Soni with an athlete after a competition session',
    [480, 768],
  ),
  rishiMedal: photo(
    'rishi-soni-army-marksmanship-unit',
    1200,
    1500,
    'Rishi Soni holding a medal in front of the Army Marksmanship Unit banner',
  ),
  championshipGroup: photo(
    'district-championship-group',
    1200,
    800,
    'Medal winners from Bhopal Shooting Range together after the district air rifle and pistol championship',
  ),
  championshipMedalBoys: photo(
    'district-championship-medal-boys',
    1200,
    800,
    'Young shooters being congratulated as they receive their medals at the district championship',
  ),
  championshipMedalCeremony: photo(
    'district-championship-medal-ceremony',
    1200,
    800,
    'An athlete receiving her medal at the first Bhopal district air rifle and pistol championship',
  ),
  issfCertificate: photo(
    'rishi-soni-issf-certificate',
    1200,
    800,
    'Rishi Soni receiving his certificate at the ISSF B Coaches Course in New Delhi',
  ),
  issfCourseGroup: photo(
    'issf-b-coaches-course-group',
    1200,
    800,
    'Rishi Soni with the instructors and organisers of the ISSF B Coaches Course',
  ),
}

export type Discipline = {
  code: string
  name: string
  detail: string
  image: ImageAsset
}

export const disciplines: Discipline[] = [
  {
    code: 'P1',
    name: '10m Air Pistol',
    detail: 'Olympic event · 60 shots',
    image: photos.firingPoint,
  },
  {
    code: 'P2',
    name: '10m Air Pistol (ISSF)',
    detail: 'Olympic event · 60 shots',
    image: photos.pistolSquad,
  },
  {
    code: 'P3',
    name: '25mtr Pistol',
    detail: 'Precision and duelling stages',
    image: photos.twentyFiveMetreAthlete,
  },
  {
    code: 'P4',
    name: '25mtr Pistol',
    detail: 'Precision and duelling stages',
    image: photos.twentyFiveMetrePistol,
  },
  {
    code: 'P5',
    name: '50mt Pistol',
    detail: 'Olympic event',
    image: photos.outdoorRange,
  },
  {
    code: 'P6',
    name: '50m Pistol',
    detail: 'Free pistol · the long-range precision test',
    image: photos.freePistol,
  },
  {
    code: 'R1',
    name: '50m Rifle 3 Positions',
    detail: 'Kneeling, prone and standing',
    image: photos.fiftyMetreRifle,
  },
  {
    code: 'R2',
    name: '10 Meter Air Rifle',
    detail: 'Olympic event · 60 shots',
    image: photos.rifleAthletes,
  },
]

export type ProofPoint = {
  value: string
  label: string
  /** Where a visitor can verify the figure, when it comes from a public source. */
  source?: { href: string; label: string }
}

export const home = {
  hero: {
    eyebrow: 'Pistol & rifle shooting academy · Bairagarh, Bhopal',
    title: ["Bhopal's best", 'Pistol & Rifle coaching.'],
    body:
      'Focused pistol and rifle coaching in Bairagarh with ISSF-certified coach Rishi Soni, who competes at national and Indian team squad trials level.',
    image: photos.firingPoint,
  },
  proofLabel: 'The range at a glance',
  proof: [
    {
      value: '4.8★',
      label: '885 reviews on Justdial',
      source: { href: publicResearchSources.businessProfile, label: 'See the Justdial profile' },
    },
    { value: '2021', label: 'Training Bhopal since' },
    { value: '10m–50m', label: 'Pistol programme' },
    { value: 'ISSF', label: 'Certified coaching' },
  ] satisfies ProofPoint[],
  disciplines: {
    eyebrow: 'What we coach',
    title: 'Pistol and rifle, on one firing line.',
    intro:
      'Most ranges in the city stop at 10m air. Here the coaching runs through the full ISSF pistol programme — and rifle shooters are welcome too.',
  },
  coach: {
    eyebrow: 'Head coach',
    title: 'Rishi Soni still shoots the matches he coaches you for.',
    lead:
      'He is not a retired name on a wall. Rishi competes at national squad trials level while he coaches, so what he teaches on Tuesday is what he shot at a match last month.',
    highlights: [
      'ISSF-certified coach — A, B, C and D licences in pistol',
      'NIS Patiala Grade A, plus NRAI and MPSRA Grade A certification',
      'Represented Madhya Pradesh at nationals in 10m, 25m and 50m pistol',
      'Competes in Indian Team Selection Trials',
      'Coaches the full pistol programme, from first shot to match day',
    ],
    image: photos.rishiShooting,
    link: { label: 'Read his full profile', href: '/coaches/' },
  },
  athletes: {
    eyebrow: 'Our shooters',
    title: 'The medals leave from this firing line.',
    intro:
      'Shooters coached here compete at district and state level, including the first Bhopal District Air Rifle and Pistol Championship — where the range took home a row of medals.',
    images: [photos.championshipMedalCeremony, photos.championshipMedalBoys, photos.championshipGroup],
    caption: 'First Bhopal District Air Rifle & Pistol Championship',
  },
  achievements: {
    eyebrow: 'Student achievements',
    title: 'Competition results, at a glance.',
    intro: 'Placeholder figures for layout review. Replace these with verified student results before publishing.',
    items: [
      { value: 'XX+', label: 'Competition medals', detail: 'District and state events' },
      { value: 'XXX', label: 'Highest match score', detail: 'Event and category to confirm' },
      { value: 'XX', label: 'State qualifiers', detail: 'Across pistol and rifle' },
      { value: 'XX', label: 'National starts', detail: 'Student appearances' },
    ],
  },
  difference: {
    eyebrow: 'Why here',
    title: 'What you get on this line.',
    items: [
      {
        title: 'A coach who competes',
        body: 'Corrections come from someone shooting the same matches this season, not from a textbook written a decade ago.',
      },
      {
        title: 'Pistol and rifle coaching',
        body: 'Technique, equipment and the shot plan get proper coaching time in both disciplines, from first session to competition preparation.',
      },
      {
        title: 'A clear competition pathway',
        body: 'Move from a first trial through technical foundations and into structured preparation for state and national competition.',
      },
      {
        title: 'Small numbers on the line',
        body: 'You get watched shot by shot. Nobody is left to burn through pellets unsupervised.',
      },
    ],
  },
  pathways: {
    eyebrow: 'How you progress',
    title: 'Start anywhere. There is a next step from there.',
    items: [
      {
        number: '01',
        title: 'Trial session',
        audience: 'Never held a pistol',
        body: 'Safety, the equipment, and your first coached shots. You leave knowing whether the sport is for you.',
      },
      {
        number: '02',
        title: 'Foundation',
        audience: 'Training regularly',
        body: 'Build a stance, grip, sight picture and trigger release you can repeat — the part that decides your score.',
      },
      {
        number: '03',
        title: 'Competition',
        audience: 'Shooting for state and national selection',
        body: 'Match routines, pressure work, technical review and a plan built around your event calendar.',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Testimonials',
    title: 'What shooters say about training here.',
    items: [
      {
        quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.',
        name: 'Student name',
        detail: '10m Air Pistol',
      },
      {
        quote: 'Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus.',
        name: 'Parent name',
        detail: 'Junior shooter parent',
      },
      {
        quote: 'Maecenas faucibus mollis interdum. Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        name: 'Student name',
        detail: 'Competition squad',
      },
    ],
  },
  gallery: {
    eyebrow: 'Inside the range',
    title: 'Bairagarh, most evenings.',
    images: [
      photos.targets,
      photos.firingPoint,
      photos.pistolSquad,
      photos.firingLineWide,
      photos.rifleAthletes,
      photos.rishiWithAthlete,
    ],
  },
  faq: {
    eyebrow: 'Before you come',
    title: 'The questions we get asked most.',
    items: [
      {
        question: 'I have never shot before. Can I still book?',
        answer:
          'Yes — most people who walk in have never held a pistol. A trial session covers range safety, the equipment and your first coached shots. No experience needed.',
      },
      {
        question: 'Do I need to buy a pistol first?',
        answer:
          'No. Do not buy anything before you have spoken to us. Ask what is available to use for your trial, and we will tell you when buying your own is worth it.',
      },
      {
        question: 'Do you coach rifle as well?',
        answer:
          'Yes. The range coaches 10 metre air rifle and 50m Rifle 3 Positions. Pistol is what we are known for and where the deepest coaching sits.',
      },
      {
        question: 'What is the right age to start?',
        answer:
          'It depends on the child rather than the birthday — height, attention span and the ability to follow range commands all matter. Message us and we will tell you honestly whether to start now or wait.',
      },
      {
        question: 'What should I wear?',
        answer:
          'Comfortable clothes and flat, closed shoes you can stand still in. That is all a first session needs.',
      },
      {
        question: 'Can you get me to state or national level?',
        answer:
          'Shooters from this range compete at district and state level. How fast you get there depends on your consistency and how much you train — Rishi will tell you where you actually stand.',
      },
    ],
  },
  closing: {
    eyebrow: 'Come and shoot',
    title: 'Book a trial. Bring nothing but flat shoes.',
    body: 'Tell us who the session is for and what you want out of it. We will find you a slot.',
  },
}

export const about = {
  hero: {
    eyebrow: 'About the range',
    title: ['One range,', 'built for pistol.'],
    body:
      'Bhopal Shooting Range opened in Bairagarh in 2021 and has coached the city ever since — beginners, school shooters and state-level competitors on the same line.',
    image: photos.pistolSquad,
  },
  story: {
    eyebrow: 'Why it exists',
    title: 'Bhopal had rifle ranges. Pistol shooters had nowhere to go.',
    body: [
      'Pistol is the harder sell. It needs more coaching time, more patience and a coach who actually shoots it. Most ranges treat it as an add-on, so pistol shooters in Bhopal either travelled or gave up.',
      'This range was built the other way round. Pistol is the centre of the coaching, across 10m, 25m and 50m events, with 10m and 50m rifle coached alongside.',
    ],
  },
  values: {
    eyebrow: 'How we run it',
    title: 'Three things we do not compromise on.',
    items: [
      {
        title: 'Safety before anything',
        body: 'Range commands, muzzle discipline and handling are taught on day one and enforced every day after. Parents can watch a session and see it.',
      },
      {
        title: 'Honest feedback',
        body: 'You will be told what is actually wrong with your shot and how long it will take to fix. Nobody here promises a national medal to sell a package.',
      },
      {
        title: 'Coaching, not lane rental',
        body: 'Shooters are watched and corrected while they shoot. Paying for time on the line without a coach beside you builds bad habits faster than no practice at all.',
      },
    ],
  },
  ownership: {
    eyebrow: 'Ownership',
    text: 'Bhopal Shooting Range is owned by Jyoti Soni and Richa Raghuwanshi.',
  },
  visit: {
    eyebrow: 'Find us',
    title: 'Bairagarh, opposite the TVS showroom.',
    addressLabel: 'Address',
    hoursLabel: 'Open',
    address: site.address.lines,
    hours: site.hours,
    link: { label: 'Get directions', href: site.directions },
  },
  coach: {
    eyebrow: 'Who coaches you',
    title: 'A national competitor, on the line with you.',
    body:
      'Rishi Soni heads the pistol coaching — ISSF-certified across four licence grades, and still shooting nationals himself.',
    image: photos.rishiShooting,
    link: { label: 'Meet the coach', href: '/coaches/' },
  },
  closing: {
    eyebrow: 'Come see it',
    title: 'Walk in, watch a session, then decide.',
    body: 'Message us and we will tell you when to come by.',
  },
}

export const coaches = {
  hero: {
    eyebrow: 'Head pistol coach',
    title: ['Rishi', 'Soni.'],
    body:
      'ISSF-certified pistol coach and active national-level competitor, coaching every ISSF pistol event at Bhopal Shooting Range.',
    image: photos.rishiShooting,
  },
  intro: {
    eyebrow: 'The short version',
    title: 'Certified to coach it. Still competing in it.',
    highlights: [
      'ISSF Certified Coach — licence grades A, B, C and D in pistol',
      'NIS Patiala (Sports Authority of India) — Grade A in shooting',
      'NRAI Certified Coach — Grade A',
      'MPSRA Certified Coach — Grade A',
      'National competitor for Madhya Pradesh, 2022 to 2026',
      'Indian Team Selection Trials participant',
      'Coaches 10m, 25m and 50m pistol, plus 10m and 50m rifle',
    ],
    image: photos.rishiMedal,
  },
  record: {
    eyebrow: 'Competition record',
    title: 'Four seasons on the national line.',
    items: [
      { year: '2022', text: 'National 10m Air Pistol competition, with renowned-shot qualification.' },
      { year: '2023', text: 'Represented Madhya Pradesh at nationals in 10m and 50m pistol.' },
      { year: '2024–25', text: 'National competition across the 25m pistol disciplines.' },
      { year: '2026', text: 'Competing in Indian Team Selection Trials.' },
    ],
    sourceLabel: 'Record independently supported by NRAI results.',
  },
  method: {
    eyebrow: 'How he coaches',
    title: 'Fix the shot, then learn to repeat it under pressure.',
    items: [
      {
        number: '01',
        title: 'The technical shot',
        body: 'Stance, grip pressure, sight picture, breathing and trigger release — corrected one at a time until the shot repeats itself.',
      },
      {
        number: '02',
        title: 'The head',
        body: 'A routine you can fall back on when the score matters, and a way to let go of the last shot before the next one.',
      },
      {
        number: '03',
        title: 'Your plan',
        body: 'Training built around your level, your event and the date of your next match — not a fixed syllabus everyone gets.',
      },
    ],
  },
  credentials: {
    eyebrow: 'Certificates on record',
    title: 'The paperwork, if you want to check it.',
    documents: [
      {
        image: credential(
          'issf-coaches-license-d',
          'ISSF Coaches License D issued to Rishi Soni, certified shooting sports coach class D in pistol',
        ),
        title: 'ISSF Coaches License D',
        issuer: 'ISSF Academy',
        detail: 'Certified Shooting Sports Coach, Class D in Pistol · Licence P0124-1944-D · 6 December 2024',
        href: '/credentials/issf-coaches-license-d-1600.webp',
        hrefLabel: 'View certificate',
      },
      {
        image: credential(
          'issf-d-diploma',
          'ISSF Academy diploma awarded to Rishi Soni for the D Level Coach Course in Pistol',
        ),
        title: 'ISSF D Level Coach Course',
        issuer: 'ISSF Academy',
        detail: 'D Level Coach Course in Pistol · Completed 10 January 2025',
        href: '/credentials/issf-d-diploma-1600.webp',
        hrefLabel: 'View certificate',
      },
      {
        image: credential(
          'nrai-coaches-course',
          'NRAI National Coaches Course certificate awarded to Rishi Soni',
        ),
        title: 'NRAI National Coaches Course',
        issuer: 'National Rifle Association of India',
        detail: 'National Coaches Course (Pistol) · Ahmedabad, 4–10 July 2025',
        href: '/credentials/nrai-coaches-course-1600.webp',
        hrefLabel: 'View certificate',
      },
      {
        image: credential(
          'nis-patiala-coaching',
          'Sports Authority of India certificate for the six-week sports coaching course in shooting, awarded to Rishi Soni',
        ),
        title: 'NIS Patiala · Sports Coaching',
        issuer: 'Sports Authority of India',
        detail: 'Six-Week Certificate Course in Sports Coaching (Shooting) · Grade A · May–June 2023',
        href: '/credentials/nis-patiala-coaching-1600.webp',
        hrefLabel: 'View certificate',
      },
    ] satisfies CredentialAsset[],
    gallery: {
      intro: 'ISSF “B” Coaches Course for rifle, pistol and shotgun · New Delhi, January 2026.',
      images: [photos.issfCertificate, photos.issfCourseGroup],
    },
  },
  closing: {
    eyebrow: 'Train with Rishi',
    title: 'Bring the level you are at now.',
    body: 'Message the range and tell us what you want to shoot.',
  },
}

export const contact = {
  hero: {
    eyebrow: 'Book a session',
    title: ['Come and', 'shoot.'],
    body: 'Tell us who the session is for and what you want from it. We reply on WhatsApp.',
  },
  form: {
    title: 'Book a trial on WhatsApp',
    intro: 'Fill this in and it opens a message to the range with your details already written.',
    messageIntro: trialMessageText,
    messageLabels: {
      name: 'Name',
      age: 'Age',
      discipline: 'Discipline',
      level: 'Level',
      goal: 'Goal',
    },
    selectPlaceholder: 'Select one',
    fields: {
      name: 'Name',
      age: 'Age',
      discipline: 'Preferred discipline',
      level: 'Current level',
      goal: 'What would you like to achieve?',
    },
    disciplines: ['Not sure yet', '10m Air Pistol', '25m Pistol', '50m Pistol', '10 Meter Air Rifle', '50m Rifle 3 Positions'],
    levels: ['Never shot before', 'Shoot for fun', 'Training regularly', 'Competing already', 'Asking for my child'],
    submit: 'Continue on WhatsApp',
  },
  details: {
    eyebrow: 'Or reach us directly',
    title: 'Call, message, or just turn up.',
    addressLabel: 'Address',
    hoursLabel: 'Open',
    directionsLabel: 'Get directions',
    channels: [
      { label: 'WhatsApp', value: site.phoneDisplay, href: primaryCta.href, external: true },
      { label: 'Phone', value: site.phoneDisplay, href: `tel:+${site.whatsappNumber}` },
      { label: 'Instagram', value: site.instagram.handle, href: site.instagram.href, external: true },
      { label: 'Facebook', value: site.facebook.handle, href: site.facebook.href, external: true },
    ],
    address: site.address.lines,
    hours: site.hours,
    directions: site.directions,
  },
  expectation: {
    eyebrow: 'What happens next',
    title: 'No sales call. Three messages and a time.',
    items: [
      { title: 'You tell us the basics', body: 'Age, whether you have shot before, and which discipline you are curious about.' },
      { title: 'We suggest a session', body: 'Trial or assessment, depending on where you are, and when there is space on the line.' },
      { title: 'We confirm the details', body: 'Timing, what it costs and what to bring — before you travel out to Bairagarh.' },
    ],
  },
}

export const footer = {
  statement: 'Pistol and rifle shooting coaching in Bairagarh, Bhopal.',
  exploreLabel: 'Explore',
  startLabel: 'Start here',
  legal: `© ${new Date().getFullYear()} ${site.name}`,
}

export const notFound = {
  eyebrow: '404',
  title: 'That one went off target.',
  body: 'Head back to the homepage, or just book a session.',
  link: { label: 'Back to home', href: '/' },
}

export const machineReadable = {
  summary:
    `A pistol and rifle shooting academy in Bairagarh, Bhopal, led by ISSF-certified coach and national and Indian team squad trials competitor ${headCoach.name}.`,
  addressLabel: 'Address',
  phoneLabel: 'Phone and WhatsApp',
  hoursLabel: 'Opening hours',
  coachLabel: 'Head coach',
  coachName: headCoach.name,
  notesTitle: 'Notes',
  notes: [
    `${site.name} is a private academy and is separate from the Madhya Pradesh State Shooting Academy of Excellence.`,
    'Current fees and batch timings should be confirmed directly with the academy on WhatsApp.',
  ],
}
