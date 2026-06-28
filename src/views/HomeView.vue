<script setup>
import { computed, ref } from 'vue'
import { Activity, Sparkles, TrendingUp } from '@lucide/vue'
import ArticleCard from '../components/ArticleCard.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import SearchBar from '../components/SearchBar.vue'
import { articles, categories, watchlist } from '../data/news'

const activeCategory = ref('Tous')
const query = ref('')

const filteredArticles = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  return articles.filter((article) => {
    const matchesCategory = activeCategory.value === 'Tous' || article.category === activeCategory.value
    const searchable = [article.title, article.summary, article.source, article.category, ...article.tags]
      .join(' ')
      .toLowerCase()

    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
  })
})
</script>

<template>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow"><Sparkles :size="16" /> Radar IA francophone</p>
      <h1>IA-news</h1>
      <p>
        Un tableau de veille pour suivre les signaux importants de l'intelligence artificielle,
        sans bruit inutile.
      </p>
    </div>

    <aside class="signal-panel" aria-label="Tendances a surveiller">
      <div class="panel-title">
        <TrendingUp :size="18" />
        <span>A surveiller</span>
      </div>
      <ul>
        <li v-for="item in watchlist" :key="item">{{ item }}</li>
      </ul>
    </aside>
  </section>

  <section class="toolbar" aria-label="Recherche et filtres">
    <SearchBar v-model="query" />
    <CategoryFilter :categories="categories" :active="activeCategory" @select="activeCategory = $event" />
  </section>

  <section class="section-heading">
    <div>
      <p class="eyebrow"><Activity :size="16" /> Flux editorial</p>
      <h2>Dernieres analyses</h2>
    </div>
    <span>{{ filteredArticles.length }} article{{ filteredArticles.length > 1 ? 's' : '' }}</span>
  </section>

  <section v-if="filteredArticles.length" class="article-grid">
    <ArticleCard v-for="article in filteredArticles" :key="article.slug" :article="article" />
  </section>

  <section v-else class="empty-state">
    <h2>Aucun article trouve</h2>
    <p>Essaie un autre mot-cle ou une autre categorie.</p>
  </section>
</template>
