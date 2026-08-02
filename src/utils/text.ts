export function boldify(text: string | null | undefined): string {
  if (!text) return ''
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-ink font-semibold">$1</strong>')
}
