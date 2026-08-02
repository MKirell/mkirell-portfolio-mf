import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { storeToRefs } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolio'
import { docUrl } from '@/utils/docs'
import type { ApiExperience } from '@/types/api'

type Lang = string

export type ShellLineKind = 'prompt' | 'heading' | 'text' | 'rich' | 'dim' | 'error' | 'blank'

export interface ShellLine {
  id: number
  kind: ShellLineKind
  text: string
}

function fmt(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '')
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const ROOT_FILES = [
  'about.md',
  'experience/',
  'projects/',
  'skills.md',
  'education.md',
  'achievements.md',
  'contact.md',
  'resume.pdf',
]

export interface UseShell {
  lines: Ref<ShellLine[]>
  inputValue: Ref<string>
  placeholder: ComputedRef<string>
  onKeydown: (e: KeyboardEvent) => void
  activate: () => void
}

export function useShell(): UseShell {
  const { lang, setLang, availableLangs } = useLanguage()
  const store = usePortfolioStore()
  const { about, achievements, education, experiences, person, projects, skillCategories, ui } =
    storeToRefs(store)

  const lines = ref<ShellLine[]>([])
  const inputValue = ref('')
  const placeholder = computed(() => ui.value.shell.placeholder)
  const commandHistory: string[] = []
  let historyPos = 0
  let idCounter = 0
  let activated = false

  function push(kind: ShellLineKind, text = ''): void {
    lines.value.push({ id: idCounter++, kind, text })
  }

  function pushMany(kind: ShellLineKind, items: string[]): void {
    items.forEach((item) => push(kind, item))
  }

  function activate(): void {
    if (activated) return
    activated = true
    ui.value.shell.welcome.forEach((line) => push(line ? 'dim' : 'blank', line))
  }

  function projectSlugs(): string[] {
    return projects.value.map((p) => slugify(p.title))
  }

  function jobSlugs(): string[] {
    return experiences.value.map((j) => slugify(j.company))
  }

  function sectionOrder(): string[] {
    return ['hero', ...Object.keys(ui.value.nav)]
  }

  function supportedLangs(): Lang[] {
    return availableLangs.value.map(
      (m: { code: string; label: string; flagCode: string }) => m.code,
    )
  }

  function resumeInfo(): { file: string; url: string | undefined } {
    const file = person.value.resume ?? ''
    return { file, url: docUrl(file) }
  }

  function printAbout(): void {
    push('heading', ui.value.headings.about)
    pushMany('rich', about.value.paragraphs)
  }

  function printSkills(): void {
    push('heading', ui.value.headings.skills)
    skillCategories.value.forEach((cat) => {
      push('text', cat.title)
      push('dim', '  ' + cat.tags.join(', '))
    })
  }

  function printJob(job: ApiExperience): void {
    push('text', `${job.role} — ${job.company}`)
    push('dim', job.period)
    job.bullets.forEach((b) => push('rich', '  • ' + b))
    push('dim', '  ' + job.tags.join(', '))
  }

  function printExperience(slug?: string): void {
    if (slug) {
      const idx = jobSlugs().indexOf(slug)
      const job = idx >= 0 ? experiences.value[idx] : undefined
      if (!job) {
        push('error', fmt(ui.value.shell.messages.catNotFound, { name: `experience/${slug}.log` }))
        return
      }
      push('heading', job.company)
      printJob(job)
      return
    }
    push('heading', ui.value.headings.experience)
    experiences.value.forEach((job, i) => {
      printJob(job)
      if (i < experiences.value.length - 1) push('blank')
    })
  }

  function printProjects(slug?: string): void {
    const items = projects.value
    const slugs = projectSlugs()
    if (slug) {
      const idx = slugs.indexOf(slug)
      const project = idx >= 0 ? items[idx] : undefined
      if (!project) {
        push('error', fmt(ui.value.shell.messages.catNotFound, { name: `projects/${slug}.proj` }))
        return
      }
      push('heading', `${project.title} — ${project.badge}`)
      push('dim', project.period)
      push('rich', project.desc)
      push('dim', '  ' + project.tags.join(', '))
      return
    }
    push('heading', ui.value.headings.projects)
    items.forEach((project, i) => {
      push('text', `${project.title} — ${project.badge} (${project.period})`)
      push('rich', '  ' + project.desc)
      if (i < items.length - 1) push('blank')
    })
  }

  function printEducation(): void {
    push('heading', ui.value.headings.education)
    push('text', ui.value.labels.degrees)
    education.value.degrees.forEach((d) => {
      push(
        'dim',
        `  ${d.years}  ${d.title} — ${d.school ?? ''}${d.mention ? ' (' + d.mention + ')' : ''}`,
      )
    })
    push('blank')
    push('text', ui.value.labels.certifications)
    education.value.certifications.forEach((c) => {
      push('dim', `  ${c.date}  ${c.title} — ${c.issuer}`)
    })
    push('blank')
    push('text', ui.value.labels.spokenLanguages)
    education.value.spokenLanguages.forEach((l) => {
      push('dim', `  ${l.name} — ${l.level} (${l.pct}%)`)
    })
  }

  function printAchievements(): void {
    push('heading', ui.value.headings.achievements)
    push('text', ui.value.labels.volunteering)
    achievements.value.volunteering.forEach((v) => {
      push('dim', `  ${v.org} — ${v.role} (${v.period})`)
      push('rich', '  ' + v.desc)
    })
    push('blank')
    push('text', ui.value.labels.awards)
    achievements.value.awards.forEach((a) => {
      push('dim', `  ${a.title}${a.place ? ' — ' + a.place : ''}`)
    })
  }

  function printContact(): void {
    push('heading', ui.value.headings.contact)
    push('rich', ui.value.contactDesc)
    push('text', `${ui.value.labels.email}: ${person.value.professionalEmail}`)
    push('text', `${ui.value.labels.phone}: ${person.value.phoneDisplay}`)
    push('text', `${ui.value.labels.linkedin}: ${person.value.linkedinHandle}`)
    push(
      'text',
      `${ui.value.labels.location}: ${person.value.addressLocality}, ${person.value.addressCountryName}`,
    )
  }

  function printNeofetch(): void {
    const shell = ui.value.shell
    push('heading', `${shell.promptUser}@${shell.promptHost}`)
    push('dim', '-'.repeat(`${shell.promptUser}@${shell.promptHost}`.length))
    push(
      'text',
      `OS: MKirellOS (${person.value.addressLocality}, ${person.value.addressCountryName})`,
    )
    push('text', `Role: ${ui.value.hero.cardRole}`)
    push('text', `Employer: ${person.value.worksFor}`)
    push('text', `Languages: ${education.value.spokenLanguages.map((l) => l.name).join(', ')}`)
    push('text', `Stack: ${ui.value.hero.skills.join(', ')}`)
    about.value.stats.forEach((s) => push('dim', `${s.num} ${s.label}`))
  }

  function openLink(url: string): void {
    push('text', fmt(ui.value.shell.messages.linkOpening, { url }))
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function cat(name: string): void {
    const clean = name.trim()
    if (!clean) {
      push('error', ui.value.shell.messages.catUsage)
      return
    }
    if (clean.startsWith('experience/')) {
      printExperience(clean.slice('experience/'.length).replace(/\.log$/, ''))
      return
    }
    if (clean.startsWith('projects/')) {
      printProjects(clean.slice('projects/'.length).replace(/\.proj$/, ''))
      return
    }
    switch (clean) {
      case 'about.md':
        printAbout()
        return
      case 'skills.md':
        printSkills()
        return
      case 'education.md':
        printEducation()
        return
      case 'achievements.md':
        printAchievements()
        return
      case 'contact.md':
        printContact()
        return
      case 'resume.pdf':
      case 'cv.pdf':
        runResume()
        return
      default:
        push('error', fmt(ui.value.shell.messages.catNotFound, { name: clean }))
    }
  }

  function ls(dir?: string): void {
    if (dir === 'experience' || dir === 'experience/') {
      pushMany(
        'dim',
        jobSlugs().map((s) => `${s}.log`),
      )
      return
    }
    if (dir === 'projects' || dir === 'projects/') {
      pushMany(
        'dim',
        projectSlugs().map((s) => `${s}.proj`),
      )
      return
    }
    if (dir) {
      push('error', fmt(ui.value.shell.messages.catNotFound, { name: dir }))
      return
    }
    push('dim', ROOT_FILES.join('  '))
  }

  function runResume(): void {
    const { file, url } = resumeInfo()
    push('text', fmt(ui.value.shell.messages.resumeOpening, { file }))
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  function runCd(target?: string): void {
    if (!target) {
      push(
        'error',
        fmt(ui.value.shell.messages.cdUsage, { sections: ui.value.shell.messages.cdSections }),
      )
      return
    }
    const name = target === '~' || target === '..' ? 'hero' : target.toLowerCase()
    if (!sectionOrder().includes(name)) {
      push(
        'error',
        fmt(ui.value.shell.messages.cdUnknown, {
          name: target,
          sections: ui.value.shell.messages.cdSections,
        }),
      )
      return
    }
    push('text', fmt(ui.value.shell.messages.cdNavigating, { section: name }))
    document.getElementById(name)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function runLang(code?: string): void {
    const lowered = code?.toLowerCase()
    if (!lowered || !supportedLangs().includes(lowered as Lang)) {
      push('error', fmt(ui.value.shell.messages.langUnknown, { code: code ?? '' }))
      return
    }
    setLang(lowered as Lang)
    push('text', fmt(ui.value.shell.messages.langSwitched, { lang: lowered }))
  }

  function runMan(cmd?: string): void {
    if (!cmd) {
      push('error', ui.value.shell.messages.manUsage)
      return
    }
    const entry = ui.value.shell.helpItems.find((h) => h.cmd.split(' ')[0] === cmd.toLowerCase())
    if (!entry) {
      push('error', fmt(ui.value.shell.messages.manUnknown, { cmd }))
      return
    }
    push('text', `${entry.cmd} — ${entry.desc}`)
  }

  const HANDLERS: Record<string, (args: string[]) => void> = {
    help: () => {
      push('heading', ui.value.shell.helpIntro)
      ui.value.shell.helpItems.forEach((h) => push('dim', `  ${h.cmd.padEnd(16)} ${h.desc}`))
      push('text', ui.value.shell.helpFooter)
    },
    about: () => printAbout(),
    whoami: () =>
      push(
        'text',
        `${ui.value.shell.messages.whoamiRole} ${person.value.name} — ${ui.value.hero.cardRole} @ ${person.value.worksFor}.`,
      ),
    pwd: () => push('dim', `/home/${ui.value.shell.promptUser}`),
    date: () => push('dim', new Date().toLocaleString(lang.value || undefined)),
    echo: (args) => push('text', args.join(' ')),
    ls: (args) => ls(args[0]),
    dir: () => push('text', ui.value.shell.messages.dirJoke),
    cat: (args) => cat(args[0] ?? ''),
    skills: () => printSkills(),
    experience: (args) => printExperience(args[0]),
    exp: (args) => printExperience(args[0]),
    projects: (args) => printProjects(args[0]),
    proj: (args) => printProjects(args[0]),
    education: () => printEducation(),
    edu: () => printEducation(),
    achievements: () => printAchievements(),
    contact: () => printContact(),
    resume: () => runResume(),
    cv: () => runResume(),
    github: () => openLink(person.value.github),
    gh: () => openLink(person.value.github),
    linkedin: () => openLink(person.value.linkedin),
    li: () => openLink(person.value.linkedin),
    email: () => {
      push('text', ui.value.shell.messages.emailOpening)
      window.location.href = `mailto:${person.value.professionalEmail}`
    },
    mail: (args) => HANDLERS.email(args),
    cd: (args) => runCd(args[0]),
    goto: (args) => runCd(args[0]),
    lang: (args) => runLang(args[0]),
    neofetch: () => printNeofetch(),
    fetch: () => printNeofetch(),
    history: () => {
      if (!commandHistory.length) {
        push('dim', ui.value.shell.messages.historyEmpty)
        return
      }
      commandHistory.forEach((cmd, i) => push('dim', `  ${i + 1}  ${cmd}`))
    },
    clear: () => {
      lines.value = []
    },
    cls: (args) => HANDLERS.clear(args),
    sl: () => push('text', ui.value.shell.messages.slJoke),
    man: (args) => runMan(args[0]),
    sudo: (args) => {
      const rest = args.join(' ').toLowerCase()
      if (rest === 'make me a sandwich') push('text', ui.value.shell.messages.sudoSandwich)
      else if (rest.startsWith('rm -rf')) push('error', ui.value.shell.messages.sudoRm)
      else push('error', ui.value.shell.messages.sudoDenied)
    },
    exit: () => push('text', ui.value.shell.messages.exitMsg),
    quit: (args) => HANDLERS.exit(args),
    logout: (args) => HANDLERS.exit(args),
  }

  const COMMAND_NAMES = Object.keys(HANDLERS)

  function execute(raw: string): void {
    const trimmed = raw.trim()
    push('prompt', trimmed)
    if (!trimmed) return
    commandHistory.push(trimmed)
    const tokens = trimmed.split(/\s+/)
    const cmd = tokens[0].toLowerCase()
    const args = tokens.slice(1)
    const handler = HANDLERS[cmd]
    if (!handler) {
      push('error', fmt(ui.value.shell.messages.notFound, { cmd }))
      push('text', ui.value.shell.messages.tryHelp)
      return
    }
    handler(args)
  }

  function submit(): void {
    execute(inputValue.value)
    inputValue.value = ''
    historyPos = commandHistory.length
  }

  function historyUp(): void {
    if (!commandHistory.length) return
    historyPos = Math.max(0, historyPos - 1)
    inputValue.value = commandHistory[historyPos] ?? ''
  }

  function historyDown(): void {
    if (!commandHistory.length) return
    historyPos = Math.min(commandHistory.length, historyPos + 1)
    inputValue.value = commandHistory[historyPos] ?? ''
  }

  function autocomplete(): void {
    const tokens = inputValue.value.split(/\s+/)
    if (tokens.length <= 1) {
      const partial = (tokens[0] ?? '').toLowerCase()
      if (!partial) return
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(partial))
      if (matches.length === 1) inputValue.value = matches[0] + ' '
      else if (matches.length > 1) push('dim', matches.join('  '))
      return
    }
    const cmd = tokens[0].toLowerCase()
    const last = tokens[tokens.length - 1]
    let candidates: string[] = []
    if (cmd === 'cat')
      candidates = [
        ...ROOT_FILES,
        ...jobSlugs().map((s) => `experience/${s}.log`),
        ...projectSlugs().map((s) => `projects/${s}.proj`),
      ]
    else if (cmd === 'cd' || cmd === 'goto') candidates = sectionOrder()
    else if (cmd === 'lang') candidates = supportedLangs()
    else if (cmd === 'man') candidates = COMMAND_NAMES
    if (!candidates.length) return
    const matches = candidates.filter((c) => c.startsWith(last))
    if (matches.length === 1) {
      tokens[tokens.length - 1] = matches[0]
      inputValue.value = tokens.join(' ')
    } else if (matches.length > 1) {
      push('dim', matches.join('  '))
    }
  }

  function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      historyUp()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      historyDown()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      autocomplete()
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      HANDLERS.clear([])
    } else if (e.key === 'Escape') {
      ;(e.target as HTMLElement | null)?.blur?.()
    }
  }

  return { lines, inputValue, placeholder, onKeydown, activate }
}
