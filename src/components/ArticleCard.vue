<script setup>
import { ArrowUpRight, Clock } from '@lucide/vue'

defineProps({
  article: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="article-card">
    <div class="card-meta">
      <span>{{ article.category }}</span>
      <span class="read-time"><Clock :size="14" /> {{ article.readTime }}</span>
    </div>

    <h2>{{ article.title }}</h2>
    <p>{{ article.summary }}</p>

    <div class="tag-row">
      <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
    </div>

    <RouterLink class="card-link" :to="{ name: 'article', params: { slug: article.slug } }">
      Lire l'analyse
      <ArrowUpRight :size="16" />
    </RouterLink>
  </article>
</template>
