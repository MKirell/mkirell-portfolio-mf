import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { boldify } from '@/utils/text'
import { flagUrl } from '@/utils/flags'
import { docUrl, imgUrl } from '@/utils/docs'
import {
  LANDING_GAP,
  isPlainClick,
  navHeight,
  onSectionLink,
  scrollToSection,
  sectionScrollTop,
} from '@/utils/scroll'

describe('boldify', () => {
  it('turns a **marked** run into a styled strong element', () => {
    expect(boldify('a **bold** word')).toBe(
      'a <strong class="text-ink font-semibold">bold</strong> word',
    )
  })

  it('converts every occurrence, not just the first', () => {
    const result = boldify('**one** and **two**')

    expect(result.match(/<strong/g)).toHaveLength(2)
  })

  it('is non-greedy so adjacent runs stay separate', () => {
    expect(boldify('**a** x **b**')).toContain('>a</strong> x <strong')
  })

  it('leaves text without markers untouched', () => {
    expect(boldify('plain text')).toBe('plain text')
  })

  it('ignores an unclosed marker', () => {
    expect(boldify('**unclosed')).toBe('**unclosed')
  })

  it('ignores empty markers', () => {
    expect(boldify('****')).toBe('****')
  })

  it('returns an empty string for null, undefined and empty input', () => {
    expect(boldify(null)).toBe('')
    expect(boldify(undefined)).toBe('')
    expect(boldify('')).toBe('')
  })
})

describe('flagUrl', () => {
  it.each(['gb', 'fr', 'tn', 'nl', 'pr'])('resolves the %s flag', (code) => {
    expect(flagUrl(code)).toBeTruthy()
  })

  it('returns undefined for a code with no asset', () => {
    expect(flagUrl('zz')).toBeUndefined()
  })

  it('is case sensitive', () => {
    expect(flagUrl('GB')).toBeUndefined()
  })
})

describe('docUrl and imgUrl', () => {
  it('builds a document path with the fit-vertical viewer hint', () => {
    expect(docUrl('resume.pdf')).toContain('files/resume.pdf#view=FitV')
  })

  it('builds an image path', () => {
    expect(imgUrl('photo.jpg')).toContain('imgs/photo.jpg')
  })

  it('returns undefined for a missing filename', () => {
    expect(docUrl(null)).toBeUndefined()
    expect(docUrl(undefined)).toBeUndefined()
    expect(docUrl('')).toBeUndefined()
    expect(imgUrl(null)).toBeUndefined()
    expect(imgUrl('')).toBeUndefined()
  })
})

describe('scroll helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    window.scrollY = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('navHeight', () => {
    it('reads the live navbar height', () => {
      const nav = document.createElement('div')
      nav.id = 'navbar'
      Object.defineProperty(nav, 'offsetHeight', { value: 90, configurable: true })
      document.body.appendChild(nav)

      expect(navHeight()).toBe(90)
    })

    it('falls back to 64 when there is no navbar', () => {
      expect(navHeight()).toBe(64)
    })
  })

  describe('sectionScrollTop', () => {
    function buildSection(styles: Partial<CSSStyleDeclaration>, rect: Partial<DOMRect>) {
      const el = document.createElement('section')
      document.body.appendChild(el)

      vi.spyOn(window, 'getComputedStyle').mockReturnValue(styles as CSSStyleDeclaration)
      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        height: 100,
        ...rect,
      } as DOMRect)

      return el
    }

    it('subtracts the declared scroll margin', () => {
      const el = buildSection({ scrollMarginTop: '20px', paddingTop: '0px' }, { top: 200 })
      window.scrollY = 100

      expect(sectionScrollTop(el)).toBe(280)
    })

    it('falls back to the navbar height when no scroll margin is set', () => {
      const el = buildSection({ scrollMarginTop: '', paddingTop: '0px' }, { top: 200 })

      expect(sectionScrollTop(el)).toBe(136)
    })

    it('lands past the padding when the section is taller than the viewport', () => {
      window.innerHeight = 500
      const el = buildSection(
        { scrollMarginTop: '20px', paddingTop: '100px' },
        { top: 200, height: 900 },
      )

      expect(sectionScrollTop(el)).toBe(180 + (100 - LANDING_GAP))
    })

    it('never returns a negative offset', () => {
      const el = buildSection({ scrollMarginTop: '500px', paddingTop: '0px' }, { top: 0 })

      expect(sectionScrollTop(el)).toBe(0)
    })
  })

  describe('scrollToSection', () => {
    it('scrolls and records the hash when the section exists', () => {
      const el = document.createElement('section')
      el.id = 'projects'
      document.body.appendChild(el)
      const replaceState = vi.spyOn(history, 'replaceState')

      expect(scrollToSection('projects')).toBe(true)
      expect(window.scrollTo).toHaveBeenCalled()
      expect(replaceState).toHaveBeenCalledWith(null, '', '#projects')
    })

    it('reports failure and does nothing when the section is missing', () => {
      const replaceState = vi.spyOn(history, 'replaceState')

      expect(scrollToSection('nowhere')).toBe(false)
      expect(replaceState).not.toHaveBeenCalled()
    })
  })

  describe('isPlainClick', () => {
    it('accepts a plain left click', () => {
      expect(isPlainClick(new MouseEvent('click', { button: 0 }))).toBe(true)
    })

    it.each([
      ['middle click', { button: 1 }],
      ['ctrl click', { ctrlKey: true }],
      ['meta click', { metaKey: true }],
      ['shift click', { shiftKey: true }],
      ['alt click', { altKey: true }],
    ])('rejects a %s so the browser can open a new tab', (_label, init) => {
      expect(isPlainClick(new MouseEvent('click', init))).toBe(false)
    })

    it('rejects an already-handled event', () => {
      const event = new MouseEvent('click', { cancelable: true })
      event.preventDefault()

      expect(isPlainClick(event)).toBe(false)
    })
  })

  describe('onSectionLink', () => {
    it('takes over navigation for an existing section', () => {
      const el = document.createElement('section')
      el.id = 'about'
      document.body.appendChild(el)
      const event = new MouseEvent('click', { button: 0, cancelable: true })

      onSectionLink(event, '#about')

      expect(event.defaultPrevented).toBe(true)
    })

    it('leaves the browser to follow a link to a section that is not on the page', () => {
      const event = new MouseEvent('click', { button: 0, cancelable: true })

      onSectionLink(event, '#missing')

      expect(event.defaultPrevented).toBe(false)
    })

    it('ignores a click with no target', () => {
      const event = new MouseEvent('click', { button: 0, cancelable: true })

      onSectionLink(event, null)
      onSectionLink(event, undefined)

      expect(event.defaultPrevented).toBe(false)
    })

    it('lets a modified click through untouched', () => {
      const el = document.createElement('section')
      el.id = 'about'
      document.body.appendChild(el)
      const event = new MouseEvent('click', { button: 0, ctrlKey: true, cancelable: true })

      onSectionLink(event, '#about')

      expect(event.defaultPrevented).toBe(false)
    })
  })
})
