import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { fetchPortfolio } from '@/services/portfolio.api'
import type { ApiPortfolio } from '@/types/api'

export const usePortfolioStore = defineStore('portfolio', () => {
  const cache = new Map<string, ApiPortfolio>()
  const data = shallowRef<ApiPortfolio | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(lang?: string): Promise<void> {
    const key = lang ?? ''
    const cached = cache.get(key)
    if (cached) {
      data.value = cached
      return
    }

    loading.value = true
    error.value = null

    try {
      let loaded: ApiPortfolio
      try {
        loaded = await fetchPortfolio(lang || undefined)
      } catch (first) {
        if (!lang || (first as { status?: number }).status !== 404) throw first
        loaded = await fetchPortfolio()
      }
      cache.set(key, loaded)
      cache.set(loaded.lang, loaded)
      data.value = loaded
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Could not reach the portfolio service'
    } finally {
      loading.value = false
    }
  }

  function required(): ApiPortfolio {
    if (!data.value) throw new Error('Portfolio accessed before it finished loading')
    return data.value
  }

  return {
    data,
    loading,
    error,
    load,
    ready: computed(() => data.value !== null),
    lang: computed(() => data.value?.lang ?? ''),
    availableLangs: computed(() => data.value?.availableLangs ?? []),
    person: computed(() => required().person),
    ui: computed(() => required().ui),
    about: computed(() => required().about),
    experiences: computed(() => required().experiences),
    projects: computed(() => required().projects),
    skillCategories: computed(() => required().skillCategories),
    education: computed(() => required().education),
    achievements: computed(() => required().achievements),
  }
})
