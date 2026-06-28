<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, CalendarDays, Clock, Radio } from '@lucide/vue'
import { articles } from '../data/news'

const route = useRoute()
const article = computed(() => articles.find((item) => item.slug === route.params.slug))
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
