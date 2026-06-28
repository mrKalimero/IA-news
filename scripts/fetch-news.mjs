import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const outputPath = join(rootDir, 'public', 'data', 'news.json')

const sourceDefinitions = [
  {
    id: 'hacker-news',
    name: 'Hacker News',
    category: 'Outils',
    url: 'https://hn.algolia.com/api/v1/search_by_date?query=artificial%20intelligence&tags=story&hitsPerPage=8',
    docsUrl: 'https://hn.algolia.com/api',
    parser: async (response) => {
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
    },
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Open source',
    url:
      'https://api.github.com/search/repositories?q=topic:artificial-intelligence+stars:%3E100&sort=updated&order=desc&per_page=8',
    docsUrl: 'https://docs.github.com/en/rest/search/search',
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    parser: async (response) => {
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
    },
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    category: 'Modeles',
    url: 'https://huggingface.co/api/models?search=artificial-intelligence&sort=lastModified&direction=-1&limit=8',
    docsUrl: 'https://huggingface.co/docs/hub/api',
    parser: async (response) => {
      const models = await response.json()

      return models
        .filter((model) => model.id)
        .map((model) =>
          createArticle({
            id: model.id,
            title: model.id,
            category: 'Modeles',
            source: 'Hugging Face',
            sourceUrl: 'https://huggingface.co/docs/hub/api',
            url: `https://huggingface.co/${model.id}`,
            date: model.lastModified,
            summary: createSummary(
              model.pipeline_tag
                ? `Modele publie sur Hugging Face pour ${model.pipeline_tag}.`
                : 'Modele repere dans le Hub Hugging Face.',
              `Modele repere dans le Hub Hugging Face: ${model.id}.`,
            ),
            tags: ['hugging-face', model.pipeline_tag || 'model', `${model.downloads || 0}-downloads`],
            impact: 'Utile pour suivre les modeles qui bougent vite dans l ecosysteme open source.',
          }),
        )
    },
  },
  {
    id: 'semantic-scholar',
    name: 'Semantic Scholar',
    category: 'Recherche',
    url:
      'https://api.semanticscholar.org/graph/v1/paper/search?query=artificial%20intelligence&limit=8&fields=title,abstract,url,publicationDate,authors',
    docsUrl: 'https://api.semanticscholar.org/api-docs/graph',
    parser: async (response) => {
      const payload = await response.json()

      return payload.data
        .filter((paper) => paper.title)
        .map((paper) =>
          createArticle({
            id: paper.paperId,
            title: paper.title,
            category: 'Recherche',
            source: 'Semantic Scholar',
            sourceUrl: 'https://api.semanticscholar.org/api-docs/graph',
            url: paper.url,
            date: paper.publicationDate,
            summary: createSummary(paper.abstract, `Publication academique liee a ${paper.title}.`),
            tags: ['semantic-scholar', 'paper', 'recherche'],
            impact: 'Bon signal pour suivre les publications citees et les tendances de recherche.',
          }),
        )
    },
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    category: 'Recherche',
    url:
      'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=8',
    docsUrl: 'https://info.arxiv.org/help/api/user-manual.html',
    parser: async (response) => parseArxivFeed(await response.text()),
  },
  {
    id: 'gdelt',
    name: 'GDELT',
    category: 'Regulation',
    url:
      'https://api.gdeltproject.org/api/v2/doc/doc?query=%22artificial%20intelligence%22%20regulation&mode=ArtList&format=json&maxrecords=8&sort=hybridrel',
    docsUrl: 'https://www.gdeltproject.org/data.html',
    parser: async (response) => {
      const payload = await response.json()

      return (payload.articles || []).map((item) =>
        createArticle({
          id: item.url,
          title: item.title,
          category: 'Regulation',
          source: 'GDELT',
          sourceUrl: 'https://www.gdeltproject.org/data.html',
          url: item.url,
          date: item.seendate,
          summary: createSummary(item.domain, `Article media repere par GDELT sur la regulation de l IA.`),
          tags: ['gdelt', 'media', item.domain || 'source'],
          impact: 'Aide a suivre les signaux media et politiques autour de la regulation IA.',
        }),
      )
    },
  },
]

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const decodeXml = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

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
  return cleanText.length > 220 ? `${cleanText.slice(0, 217).trim()}...` : cleanText
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
  title: stripHtml(title),
  category,
  source,
  sourceUrl,
  url,
  date: formatDate(date),
  readTime: '3 min',
  summary,
  body: summary,
  tags: tags.filter(Boolean).slice(0, 4),
  impact,
})

const uniqueByUrlOrTitle = (articles) => {
  const seen = new Set()

  return articles.filter((article) => {
    const key = (article.url || article.title).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const extractTag = (entry, tag) => {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? decodeXml(match[1].trim()) : ''
}

const parseArxivFeed = (xmlText) => {
  const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || []

  return entries.map((entry) => {
    const title = stripHtml(extractTag(entry, 'title') || 'Publication arXiv')
    const summary = createSummary(extractTag(entry, 'summary'), title)
    const id = extractTag(entry, 'id') || title
    const url = id.startsWith('http') ? id : 'https://arxiv.org/'

    return createArticle({
      id,
      title,
      category: 'Recherche',
      source: 'arXiv',
      sourceUrl: 'https://info.arxiv.org/help/api/user-manual.html',
      url,
      date: extractTag(entry, 'published'),
      summary,
      tags: ['arxiv', 'paper', 'recherche'],
      impact: 'Reference utile pour suivre les avancees de recherche avant leur diffusion produit.',
    })
  })
}

const fetchSource = async (source) => {
  const startedAt = Date.now()
  const response = await fetch(source.url, { headers: source.headers })

  if (!response.ok) {
    throw new Error(`${source.name} returned HTTP ${response.status}`)
  }

  const articles = await source.parser(response)

  return {
    articles,
    status: {
      id: source.id,
      name: source.name,
      category: source.category,
      docsUrl: source.docsUrl,
      ok: true,
      count: articles.length,
      latencyMs: Date.now() - startedAt,
    },
  }
}

const results = await Promise.allSettled(sourceDefinitions.map(fetchSource))
const articles = uniqueByUrlOrTitle(
  results
    .flatMap((result) => (result.status === 'fulfilled' ? result.value.articles : []))
    .sort((a, b) => new Date(b.date) - new Date(a.date)),
).slice(0, 48)

const sources = results.map((result, index) => {
  if (result.status === 'fulfilled') return result.value.status

  const source = sourceDefinitions[index]
  return {
    id: source.id,
    name: source.name,
    category: source.category,
    docsUrl: source.docsUrl,
    ok: false,
    count: 0,
    error: result.reason.message,
  }
})

const payload = {
  generatedAt: new Date().toISOString(),
  sourceMode: 'scheduled-static-json',
  articles,
  sources,
  errors: sources.filter((source) => !source.ok).map((source) => `${source.name}: ${source.error}`),
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

console.log(`Generated ${articles.length} articles from ${sources.filter((source) => source.ok).length} sources`)
