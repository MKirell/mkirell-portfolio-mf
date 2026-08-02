export interface ApiLocale {
  code: string
  label: string
  flagCode: string
}

export interface ApiPerson {
  id: string
  name: string
  givenName: string
  familyName: string
  brand: string
  professionalEmail: string
  organizationEmail: string
  phone: string
  phoneDisplay: string
  linkedin: string
  linkedinHandle: string
  github: string
  url: string
  worksFor: string
  addressCountry: string
  mapsUrl: string
  photo: string
  logoLightTheme: string
  logoDarkTheme: string
  jobTitle: string
  description: string
  addressLocality: string
  addressRegion: string
  addressCountryName: string
  resume: string | null
}

export interface ApiShellHelpItem {
  cmd: string
  desc: string
}

export interface ApiUiStrings {
  nav: Record<string, string>
  headings: Record<string, string>
  labels: Record<string, string>
  hero: {
    title: string
    subtitles: string[]
    cardRole: string
    desc: string
    skills: string[]
    skillHighlight: string
    cta: Record<string, string>
    card: Record<string, string>
  }
  shell: {
    promptUser: string
    promptHost: string
    placeholder: string
    welcome: string[]
    helpIntro: string
    helpItems: ApiShellHelpItem[]
    helpFooter: string
    messages: Record<string, string>
  }
  contactDesc: string
  footerCopy: string
}

export interface ApiAboutStat {
  id: string
  order: number
  num: string
  anchor: string | null
  label: string
}

export interface ApiExperience {
  id: string
  order: number
  current: boolean
  company: string
  tags: string[]
  doc: string | null
  link: string | null
  period: string
  role: string
  bullets: string[]
}

export interface ApiProject {
  id: string
  order: number
  title: string
  tags: string[]
  link: string | null
  period: string
  badge: string
  desc: string
}

export interface ApiSkillCategory {
  id: string
  order: number
  icon: string
  accent: boolean
  accentTags: string[]
  tags: string[]
  title: string
}

export interface ApiDegree {
  id: string
  order: number
  years: string
  doc: string | null
  link: string | null
  title: string
  school: string | null
  location: string | null
  mention: string | null
}

export interface ApiCertification {
  id: string
  order: number
  icon: string
  title: string
  issuer: string
  doc: string | null
  date: string
}

export interface ApiSpokenLanguage {
  id: string
  order: number
  flagCode: string
  pct: number
  doc: string | null
  name: string
  level: string
}

export interface ApiVolunteering {
  id: string
  order: number
  org: string
  doc: string | null
  link: string | null
  role: string
  period: string
  desc: string
}

export interface ApiAward {
  id: string
  order: number
  icon: string
  flagCode: string | null
  images: string[]
  doc: string | null
  title: string
  place: string | null
  date: string | null
}

export interface ApiPortfolio {
  lang: string
  availableLangs: ApiLocale[]
  person: ApiPerson
  ui: ApiUiStrings
  about: {
    paragraphs: string[]
    stats: ApiAboutStat[]
  }
  experiences: ApiExperience[]
  projects: ApiProject[]
  skillCategories: ApiSkillCategory[]
  education: {
    degrees: ApiDegree[]
    certifications: ApiCertification[]
    spokenLanguages: ApiSpokenLanguage[]
  }
  achievements: {
    volunteering: ApiVolunteering[]
    awards: ApiAward[]
  }
}
