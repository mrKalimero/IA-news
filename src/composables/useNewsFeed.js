import { computed, ref } from 'vue'
import { fallbackArticles } from '../data/news'
import { fetchReferenceArticles } from '../services/newsApi'

const articles = ref(fallbackArticles)
const errors = ref([])
const generatedAt = ref(null)
const isFallback = ref(true)
const isLoading = ref(false)
const hasLoaded = ref(false)
const sourceMode = ref('fallback-local')
const sources = ref([])

export const useNewsFeed = () => {
  const loadArticles = async () => {
    if (hasLoaded.value || isLoading.value) return

    isLoading.value = true

    try {
      const result = await fetchReferenceArticles()
      articles.value = result.articles
      errors.value = result.errors
      generatedAt.value = result.generatedAt
      isFallback.value = result.isFallback
      sourceMode.value = result.sourceMode
      sources.value = result.sources
      hasLoaded.value = true
    } catch (error) {
      errors.value = [error.message]
      isFallback.value = true
      sourceMode.value = 'fallback-local'
    } finally {
      isLoading.value = false
    }
  }

  return {
    articles,
    errors,
    generatedAt,
    hasErrors: computed(() => errors.value.length > 0),
    isFallback,
    isLoading,
    loadArticles,
    sourceMode,
    sources,
  }
}
