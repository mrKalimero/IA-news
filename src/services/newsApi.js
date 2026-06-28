import { fallbackArticles } from '../data/news'

export const fetchReferenceArticles = async () => {
  const response = await fetch(`${import.meta.env.BASE_URL}data/news.json`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Static news feed unavailable (${response.status})`)
  }

  const payload = await response.json()
  const articles = Array.isArray(payload.articles) && payload.articles.length ? payload.articles : fallbackArticles

  return {
    articles,
    errors: payload.errors || [],
    generatedAt: payload.generatedAt,
    isFallback: articles === fallbackArticles,
    sourceMode: payload.sourceMode || 'static-json',
    sources: payload.sources || [],
  }
}
