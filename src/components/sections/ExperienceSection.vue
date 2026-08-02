<template>
  <section
    id="experience"
    class="scroll-mt-16 max-700:scroll-mt-14 py-[110px] max-1200:py-20 max-700:py-14 bg-bg-tint"
    aria-labelledby="experience-heading"
  >
    <div class="w-full max-w-container mx-auto px-pad">
      <header v-reveal class="mb-12 max-1200:mb-10 max-700:mb-8">
        <div class="flex items-center gap-4 max-700:gap-3 mb-[22px]">
          <span
            class="flex items-center justify-center w-11 h-11 max-700:w-10 max-700:h-10 shrink-0 rounded-[12px] border border-accent/[0.28] bg-accent/[0.12] text-accent"
            aria-hidden="true"
          >
            <Briefcase :size="22" :stroke-width="1.8" />
          </span>
          <span class="font-mono text-[0.76rem] tracking-[0.12em] uppercase text-ink-soft">{{
            ui.nav.experience
          }}</span>
        </div>
        <h2
          id="experience-heading"
          class="font-disp text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold text-ink tracking-[-0.01em]"
        >
          {{ ui.headings.experience }}
        </h2>
      </header>
      <ol
        class="relative before:content-[''] before:absolute before:start-[19px] before:top-2 before:bottom-2 before:w-px before:bg-line/12 max-700:before:hidden"
      >
        <li
          v-for="(job, i) in experiences"
          :key="job.company + job.period"
          v-reveal
          class="last:mb-0 relative"
          :class="
            isOpen(i)
              ? 'flex gap-8 max-700:gap-4 mb-12 max-700:mb-8'
              : 'flex items-center gap-8 max-700:gap-4 mb-2 max-700:mb-1.5'
          "
        >
          <div
            v-if="i === 0"
            class="shrink-0 w-10 h-10 max-700:hidden rounded-full bg-surface border-2 border-accent shadow-[0_0_0_6px_theme(colors.bg)] z-[1]"
            aria-hidden="true"
          ></div>
          <button
            v-else
            type="button"
            class="shrink-0 w-10 h-10 max-700:hidden rounded-full bg-surface border-2 border-accent shadow-[0_0_0_6px_theme(colors.bg)] z-[1] flex items-center justify-center p-0 text-accent cursor-pointer transition-[transform,background-color] motion-reduce:transition-none hover:bg-accent/[0.14] hover:scale-[1.08] animate-icon-hint"
            :aria-label="isOpen(i) ? ui.labels.showLess : ui.labels.showMore"
            @click="toggleJob(i)"
          >
            <component :is="isOpen(i) ? Minus : Plus" :size="16" />
          </button>
          <article
            v-if="isOpen(i)"
            class="flex-1 bg-surface border border-line/7 rounded-lg py-[30px] px-[34px] max-700:p-[22px] transition-colors motion-reduce:transition-none hover:border-accent/[0.38]"
          >
            <header class="flex flex-wrap items-center justify-between gap-2 mb-[10px]">
              <span
                class="font-mono text-[0.78rem] font-medium text-accent-deep tracking-[0.06em] uppercase inline-flex items-center gap-2"
              >
                {{ job.company }}
                <a
                  v-if="job.link"
                  :href="job.link || undefined"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-gold -mt-px opacity-60 transition-opacity motion-reduce:transition-none hover:opacity-100 shrink-0 animate-icon-hint"
                  title="View on LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="15"
                    height="15"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </span>
              <div class="flex items-center gap-2">
                <time class="text-ink-soft text-[0.75rem]">{{ job.period }}</time>
                <a
                  v-if="job.doc"
                  :href="docUrl(job.doc)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-gold opacity-60 transition-opacity motion-reduce:transition-none hover:opacity-100 leading-none animate-icon-hint"
                  title="View attestation"
                >
                  <Paperclip :size="15" />
                </a>
              </div>
            </header>
            <p
              class="font-disp text-[1.2rem] font-semibold text-ink mb-4 flex items-center gap-[10px] flex-wrap"
            >
              {{ job.role }}
              <span
                v-if="job.current"
                class="font-mono text-[0.64rem] font-medium bg-sage/[0.12] border border-[rgba(110,127,92,0.3)] text-sage rounded-full px-[11px] py-[3px] tracking-[0.05em] uppercase"
                >{{ ui.labels.currentRole }}</span
              >
            </p>
            <ul class="ps-0 mb-[18px] flex flex-col gap-[10px]">
              <li
                v-for="(bullet, bi) in job.bullets"
                :key="bi"
                class="text-ink-soft text-[0.95rem] leading-[1.75] ps-[18px] relative before:content-['—'] before:absolute before:start-0 before:text-accent"
                v-html="boldify(bullet)"
              ></li>
            </ul>
            <ul class="flex flex-wrap gap-[7px]" aria-label="Technologies used">
              <li
                v-for="tag in job.tags"
                :key="tag"
                class="inline-flex items-center bg-surface-2 border border-line/7 rounded-sm px-[9px] py-[3px] text-[0.72rem] text-ink-soft font-mono transition motion-reduce:transition-none hover:border-accent/[0.38] hover:text-accent-deep"
              >
                {{ tag }}
              </li>
            </ul>
            <button
              v-if="i !== 0"
              type="button"
              aria-expanded="true"
              :aria-label="ui.labels.showLess"
              class="hidden max-700:flex w-full items-center justify-center mt-[18px] pt-3 border-0 border-t border-line/7 bg-transparent cursor-pointer text-accent opacity-70 transition-opacity motion-reduce:transition-none hover:opacity-100"
              @click="toggleJob(i)"
            >
              <ChevronUp :size="16" :stroke-width="2" class="animate-icon-hint" />
            </button>
          </article>
          <button
            v-else
            type="button"
            aria-expanded="false"
            :aria-label="`${job.company} — ${job.role}, ${ui.labels.showMore}`"
            class="min-w-0 flex-1 grid grid-cols-[auto_1fr_auto] max-700:grid-cols-[1fr_auto] items-baseline gap-x-2 gap-y-1 bg-surface border border-line/7 rounded-md px-4 py-[9px] max-700:px-3 max-700:py-2 text-left cursor-pointer transition-colors motion-reduce:transition-none hover:border-accent/[0.28]"
            @click="toggleJob(i)"
          >
            <span class="min-w-0 truncate text-[0.78rem] font-medium text-ink">{{
              job.company
            }}</span>
            <span
              class="min-w-0 truncate text-[0.78rem] max-700:text-[0.73rem] text-ink-soft opacity-70 max-700:col-start-1 max-700:col-span-2 max-700:row-start-2 max-700:pe-5"
              ><span aria-hidden="true" class="me-2 max-700:hidden">·</span>{{ job.role }}</span
            >
            <time
              class="shrink-0 font-mono text-[0.68rem] max-700:text-[0.63rem] text-ink-soft opacity-70 max-700:col-start-2 max-700:row-start-1"
            >
              <span
                v-for="(seg, si) in periodSegments(job.period)"
                :key="si"
                :class="seg.duration ? 'max-700:hidden' : undefined"
                ><span v-if="si > 0" aria-hidden="true"> · </span>{{ seg.text }}</span
              >
            </time>
            <ChevronDown
              :size="15"
              :stroke-width="2"
              class="hidden max-700:block max-700:col-start-2 max-700:row-start-2 justify-self-end self-center shrink-0 text-accent opacity-70 animate-icon-hint"
              aria-hidden="true"
            />
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { boldify } from '@/utils/text'
import { docUrl } from '@/utils/docs'
import { Paperclip, Plus, Minus, Briefcase, ChevronDown, ChevronUp } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()
const { experiences, ui } = storeToRefs(store)

const OPEN_BY_DEFAULT = 1
const DURATION_PART = /^\d+\s+\S+$/

const openJobs = ref(new Set(Array.from({ length: OPEN_BY_DEFAULT }, (_, i) => i)))

function periodSegments(period: string): { text: string; duration: boolean }[] {
  return period
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((text) => ({ text, duration: DURATION_PART.test(text) }))
}

function isOpen(i: number): boolean {
  return openJobs.value.has(i)
}
function toggleJob(i: number) {
  const next = new Set(openJobs.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  openJobs.value = next
}
</script>
