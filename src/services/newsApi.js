import { fallbackArticles } from '../data/news'

const HN_ENDPOINT =
  'https://hn.algolia.com/api/v1/search_by_date?query=artificial%20intelligence&tags=story&hitsPerPage=8'
const GITHUB_ENDPOINT =
  'https://api.github.com/search/repositories?q=topic:artificial-intelligence+stars:%3E100&sort=updated&order=desc&per_page=6'
const ARXIV_ENDPOINT =
  'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=6'

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const formatDate = (value) => {
  if (!value) return new Date().toISOString().slice(0, 10)
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10)
}

const createSummary = (text, fallback) => {
  const cleanText = stripHtml(text || fallback)
  return cleanText.length > 190 ? `${cleanText.slice(0, 187).trim()}...` : cleanText
}

const uniqueBySlug = (articles) => {
  const seen = new Set()
  return articles.filter((article) => {
    if (seen.has(article.slug)) return false
    seen.add(article.slug)
    return true
  })
}

const createArticle = ({
  category,
  date,
  id,
  impact,
  source,
  sourceUrl,
  summary,
  tags,
  title,
  url,
}) => ({
  slug: slugify(`${source}-${id || title}`),
  title,
  category,
  source,
  sourceUrl,
  url,
  date: formatDate(date),
  readTime: '3 min',
  summary,
  body: summary,
  tags,
  impact,
})

const fetchHackerNews = async () => {
  const response = await fetch(HN_ENDPOINT)
  if (!response.ok) throw new Error('Hacker News API unavailable')
  const payload = await response.json()

  return payload.hits
    .filter((item) => item.title && (item.url || item.story_url))
    .map((item) =>
      createArticle({
        id: item.objectID,
        title: item.title,
        category: 'Outils',
        source: 'Hacker News',
        sourceUrl: 'https://hn.algolia.com/',
        url: item.url || item.story_url,
        date: item.created_at,
        summary: createSummary(
          item.story_text,
          `Discussion technique autour de ${item.title}, reperee dans la communaute Hacker News.`,
        ),
        tags: ['hacker-news', 'tech', 'discussion'],
        impact: 'Signal utile pour reperer les sujets IA qui interessent les developpeurs et fondateurs.',
      }),
    )
}

const fetchGitHubRepositories = async () => {
  const response = await fetch(GITHUB_ENDPOINT, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })
  if (!response.ok) throw new Error('GitHub Search API unavailable')
  const payload = await response.json()

  return payload.items.map((repo) =>
    createArticle({
      id: repo.id,
      title: repo.full_name,
      category: 'Open source',
      source: 'GitHub',
      sourceUrl: 'https://docs.github.com/en/rest/search/search',
      url: repo.html_url,
      date: repo.updated_at,
      summary: createSummary(
        repo.description,
        `${repo.full_name} est un projet open source lie a l'intelligence artificielle.`,
      ),
      tags: ['github', 'open-source', `${repo.stargazers_count}-stars`],
      impact: 'A surveiller pour identifier les bibliotheques, frameworks et outils IA qui gagnent en traction.',
    }),
  )
}

const parseArxivFeed = (xmlText) => {
  const document = new DOMParser().parseFromString(xmlText, 'application/xml')
  const entries = Array.from(document.querySelectorAll('entry'))

  return entries.map((entry) => {
    const title = stripHtml(entry.querySelector('title')?.textContent || 'Publication arXiv')
    const summary = createSummary(entry.querySelector('summary')?.textContent, title)
    const id = entry.querySelector('id')?.textContent || title
    const url = id.startsWith('http') ? id : 'https://arxiv.org/'

    return createArticle({
      id,
      title,
      category: 'Recherche',
      source: 'arXiv',
      sourceUrl: 'https://info.arxiv.org/help/api/user-manual.html',
      url,
      date: entry.querySelector('published')?.textContent,
      summary,
      tags: ['arxiv', 'paper', 'recherche'],
      impact: 'Reference utile pour suivre les avancees de recherche avant leur diffusion produit.',
    })
  })
}

const fetchArxivPapers = async () => {
  const response = await fetch(ARXIV_ENDPOINT)
  if (!response.ok) throw new Error('arXiv API unavailable')
  return parseArxivFeed(await response.text())
}

export const fetchReferenceArticles = async () => {
  const sources = await Promise.allSettled([fetchHackerNews(), fetchGitHubRepositories(), fetchArxivPapers()])
  const articles = uniqueBySlug(sources.flatMap((source) => (source.status === 'fulfilled' ? source.value : [])))

  return {
    articles: articles.length ? articles : fallbackArticles,
    errors: sources
      .map((source, index) => ({ source, name: ['Hacker News', 'GitHub', 'arXiv'][index] }))
      .filter(({ source }) => source.status === 'rejected')
      .map(({ name, source }) => `${name}: ${source.reason.message}`),
    isFallback: articles.length === 0,
  }
}
