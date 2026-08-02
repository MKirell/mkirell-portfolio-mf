<template>
  <footer class="bg-bg-tint border-t border-line/7 py-[30px]" aria-label="Site footer">
    <div class="w-full max-w-container mx-auto px-pad">
      <div
        class="flex items-center justify-between gap-4 flex-wrap max-700:flex-col max-700:text-center max-700:gap-[10px]"
      >
        <img :src="logoUrl" :alt="person.brand" class="h-[26px] max-700:h-[22px] w-auto block" />

        <small class="text-ink-soft text-[0.75rem] font-mono">{{ ui.footerCopy }}</small>
        <nav class="flex gap-5" aria-label="Social links">
          <a
            :href="person.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-ink-soft text-[0.82rem] transition-colors motion-reduce:transition-none hover:text-accent-deep"
            aria-label="LinkedIn profile"
            >LinkedIn</a
          >
          <a
            :href="`mailto:${person.professionalEmail}`"
            class="text-ink-soft text-[0.82rem] transition-colors motion-reduce:transition-none hover:text-accent-deep"
            aria-label="Send email"
            >Email</a
          >
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { storeToRefs } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolio'
import { assetUrl } from '@/utils/docs'

const store = usePortfolioStore()
const { person, ui } = storeToRefs(store)

const { theme } = useTheme()
const logoUrl = computed(() =>
  assetUrl(theme.value === 'light' ? person.value.logoLightTheme : person.value.logoDarkTheme),
)
</script>
