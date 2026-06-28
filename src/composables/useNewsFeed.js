import { computed, ref } from 'vue'
import { fallbackArticles } from '../data/news'
import { fetchReferenceArticles } from '../services/newsApi'

const articles = ref(fallbackArticles)
const errors = ref([])
const isFallback = ref(true)
const isLoading = ref(false)
const hasLoaded = ref(false)

export const useNewsFeed = () => {
  const loadArticles = async () => {
    if (hasLoaded.value || isLoading.value) return

    isLoading.value = true

    try {
      const result = await fetchReferenceArticles()
      articles.value = result.articles
      errors.value = result.errors
      isFallback.value = result.isFallback
      hasLoaded.value = true
    } catch (error) {
      errors.value = [error.message]
      isFallback.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    articles,
    errors,
    hasErrors: computed(() => errors.value.length > 0),
    isFallback,
    isLoading,
    loadArticles,
  }
}
