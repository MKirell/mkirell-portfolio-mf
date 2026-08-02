import gb from '@/assets/flags/gb.svg'
import fr from '@/assets/flags/fr.svg'
import tn from '@/assets/flags/tn.svg'
import nl from '@/assets/flags/nl.svg'
import pr from '@/assets/flags/pr.svg'

const FLAGS: Record<string, string> = { gb, fr, tn, nl, pr }

export function flagUrl(code: string): string | undefined {
  return FLAGS[code]
}
