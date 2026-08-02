<template>
  <section
    id="education"
    class="scroll-mt-16 max-700:scroll-mt-14 py-[110px] max-1200:py-20 max-700:py-14"
    aria-labelledby="education-heading"
  >
    <div class="w-full max-w-container mx-auto px-pad">
      <header v-reveal class="mb-12 max-1200:mb-10 max-700:mb-8">
        <div class="flex items-center gap-4 max-700:gap-3 mb-[22px]">
          <span
            class="flex items-center justify-center w-11 h-11 max-700:w-10 max-700:h-10 shrink-0 rounded-[12px] border border-accent/[0.28] bg-accent/[0.12] text-accent"
            aria-hidden="true"
          >
            <GraduationCap :size="22" :stroke-width="1.8" />
          </span>
          <span class="font-mono text-[0.76rem] tracking-[0.12em] uppercase text-ink-soft">{{
            ui.nav.education
          }}</span>
        </div>
        <h2
          id="education-heading"
          class="font-disp text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold text-ink tracking-[-0.01em]"
        >
          {{ ui.headings.education }}
        </h2>
      </header>

      <div v-reveal class="grid grid-cols-2 max-900:grid-cols-1 gap-12">
        <div>
          <p
            class="font-mono font-medium text-accent-deep mb-[26px] tracking-[0.1em] uppercase text-[0.78rem]"
          >
            {{ ui.labels.degrees }}
          </p>
          <ul class="flex flex-col">
            <li
              v-for="deg in education.degrees"
              :key="deg.title"
              class="flex gap-5 max-480:flex-col max-480:gap-[6px] py-5 border-b border-line/7 last:border-b-0"
            >
              <time
                class="shrink-0 font-mono text-[0.72rem] text-ink-soft w-[90px] max-480:w-auto pt-[3px] max-480:pt-0"
                >{{ deg.years }}</time
              >
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-disp text-[1.05rem] font-semibold text-ink mb-[5px]">
                    {{ deg.title }}
                  </h3>
                  <a
                    v-if="deg.doc"
                    :href="docUrl(deg.doc)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-gold opacity-60 transition-opacity motion-reduce:transition-none hover:opacity-100 leading-none shrink-0 -mt-[5px] animate-icon-hint"
                    title="View diploma"
                  >
                    <Paperclip :size="15" />
                  </a>
                </div>
                <span v-if="deg.school" class="flex items-center gap-2">
                  <span class="block text-[0.85rem] text-ink font-medium">{{ deg.school }}</span>
                  <a
                    v-if="deg.link"
                    :href="deg.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-center text-gold opacity-70 shrink-0 transition-opacity motion-reduce:transition-none hover:opacity-100 animate-icon-hint"
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
                <span v-if="deg.location" class="block text-[0.85rem] text-ink-soft">{{
                  deg.location
                }}</span>
                <span
                  v-if="deg.mention"
                  class="inline-block mt-[9px] bg-gold/[0.12] border border-[rgba(184,137,59,0.3)] rounded-[6px] px-[10px] py-[2px] text-[0.76rem] text-gold font-mono"
                  >{{ deg.mention }}</span
                >
              </div>
            </li>
          </ul>
        </div>
        <div>
          <div class="flex items-center justify-between gap-3 mb-[26px]">
            <p
              class="font-mono font-medium text-accent-deep tracking-[0.1em] uppercase text-[0.78rem]"
            >
              {{ ui.labels.certifications }}
            </p>
            <div v-if="certPageCount > 1" class="flex items-center gap-[10px]">
              <button
                type="button"
                class="flex items-center justify-center w-[26px] h-[26px] rounded-full border border-line/7 bg-surface text-ink-soft cursor-pointer transition-[border-color,color,opacity] motion-reduce:transition-none enabled:hover:border-accent/[0.38] enabled:hover:text-accent-deep disabled:opacity-35 disabled:cursor-default animate-icon-hint"
                :disabled="certPage === 0"
                aria-label="Previous certifications"
                @click="prevCertPage"
              >
                <ChevronLeft :size="16" />
              </button>
              <span class="flex items-center gap-[6px]">
                <button
                  v-for="p in certPageCount"
                  :key="p"
                  type="button"
                  class="w-[6px] h-[6px] p-0 border-0 rounded-full bg-line/7 cursor-pointer transition-[background-color,transform] motion-reduce:transition-none hover:bg-accent/[0.38]"
                  :class="{ '!bg-accent-deep scale-[1.3]': certPage === p - 1 }"
                  :aria-label="`Go to certifications page ${p}`"
                  @click="certPage = p - 1"
                ></button>
              </span>
              <button
                type="button"
                class="flex items-center justify-center w-[26px] h-[26px] rounded-full border border-line/7 bg-surface text-ink-soft cursor-pointer transition-[border-color,color,opacity] motion-reduce:transition-none enabled:hover:border-accent/[0.38] enabled:hover:text-accent-deep disabled:opacity-35 disabled:cursor-default animate-icon-hint"
                :disabled="certPage === certPageCount - 1"
                aria-label="Next certifications"
                @click="nextCertPage"
              >
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>
          <ul
            :key="certPage"
            class="flex flex-col gap-[14px] animate-fade-up motion-reduce:animate-none"
          >
            <li
              v-for="(cert, i) in pagedCerts"
              :key="i"
              class="flex items-center gap-4 max-600:flex-wrap max-600:gap-y-2 bg-surface border border-line/7 rounded px-[19px] py-[16px] transition-colors motion-reduce:transition-none hover:border-accent/[0.38]"
            >
              <div
                class="shrink-0 w-10 h-10 flex items-center justify-center text-accent-deep rounded-[10px] bg-accent/[0.14]"
                aria-hidden="true"
              >
                <component :is="icons[cert.icon]" :size="19" :stroke-width="1.8" />
              </div>
              <div class="flex-1 max-600:min-w-0">
                <p class="text-[0.92rem] text-ink font-medium mb-[3px]">{{ cert.title }}</p>
                <div class="flex items-center justify-between gap-2">
                  <p class="text-ink-soft text-[0.72rem] font-mono">{{ cert.issuer }}</p>
                  <time
                    v-if="cert.date"
                    class="hidden max-900:inline shrink-0 font-mono text-[0.68rem] text-ink-soft opacity-70 whitespace-nowrap"
                    >{{ cert.date }}</time
                  >
                </div>
              </div>
              <span class="max-600:ms-auto flex items-center gap-2 shrink-0">
                <time
                  v-if="cert.date"
                  class="max-900:hidden font-mono text-[0.68rem] text-ink-soft opacity-70 whitespace-nowrap"
                  >{{ cert.date }}</time
                >
                <a
                  v-if="cert.doc"
                  :href="docUrl(cert.doc)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-gold opacity-60 transition-opacity motion-reduce:transition-none hover:opacity-100 leading-none animate-icon-hint"
                  title="View certificate"
                >
                  <Paperclip :size="15" />
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { docUrl } from '@/utils/docs'
import {
  Paperclip,
  Zap,
  MessageSquare,
  Cloud,
  BarChart3,
  Layers,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()
const { education, ui } = storeToRefs(store)

const icons: Record<string, Component> = {
  Zap,
  MessageSquare,
  Cloud,
  BarChart3,
  Layers,
  SlidersHorizontal,
}

const { lang } = useLanguage()

const CERTS_PER_PAGE = 4
const certPage = ref(0)
const certPageCount = computed(() =>
  Math.ceil(education.value.certifications.length / CERTS_PER_PAGE),
)
const pagedCerts = computed(() => {
  const start = certPage.value * CERTS_PER_PAGE
  return education.value.certifications.slice(start, start + CERTS_PER_PAGE)
})

function prevCertPage() {
  if (certPage.value > 0) certPage.value--
}
function nextCertPage() {
  if (certPage.value < certPageCount.value - 1) certPage.value++
}

watch(lang, () => {
  certPage.value = 0
})
</script>
