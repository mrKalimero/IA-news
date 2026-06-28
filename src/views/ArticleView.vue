<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, CalendarDays, Clock, ExternalLink, Radio } from '@lucide/vue'
import { useNewsFeed } from '../composables/useNewsFeed'

const route = useRoute()
const { articles, loadArticles } = useNewsFeed()
const article = computed(() => articles.value.find((item) => item.slug === route.params.slug))

onMounted(loadArticles)
</script>

<template>
  <section v-if="article" class="article-detail">
    <RouterLink class="back-link" to="/">
      <ArrowLeft :size="16" />
      Retour au flux
    </RouterLink>

    <div class="detail-shell">
      <p class="eyebrow"><Radio :size="16" /> {{ article.category }}</p>
      <h1>{{ article.title }}</h1>
      <p class="detail-summary">{{ article.summary }}</p>

      <div class="detail-meta">
        <span><CalendarDays :size="16" /> {{ article.date }}</span>
        <span><Clock :size="16" /> {{ article.readTime }}</span>
        <span>{{ article.source }}</span>
      </div>

      <p>{{ article.body }}</p>

      <div class="impact-box">
        <strong>Impact</strong>
        <span>{{ article.impact }}</span>
      </div>

      <a v-if="article.url" class="source-link" :href="article.url" target="_blank" rel="noreferrer">
        Ouvrir la source
        <ExternalLink :size="16" />
      </a>

      <div class="tag-row">
        <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
      </div>
    </div>
  </section>

  <section v-else class="empty-state">
    <h1>Article introuvable</h1>
    <RouterLink class="card-link" to="/">Revenir a l'accueil</RouterLink>
  </section>
</template>
