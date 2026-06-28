<script setup>
import { computed, ref, watchEffect } from 'vue'
import { Moon, Newspaper, Sun } from '@lucide/vue'

const storedTheme = localStorage.getItem('theme')
const darkMode = ref(storedTheme ? storedTheme === 'dark' : true)

watchEffect(() => {
  document.documentElement.dataset.theme = darkMode.value ? 'dark' : 'light'
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
})

const themeLabel = computed(() => (darkMode.value ? 'Passer en mode clair' : 'Passer en mode sombre'))
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink to="/" class="brand" aria-label="Retour a l'accueil">
        <span class="brand-icon"><Newspaper :size="22" /></span>
        <span>
          <strong>IA-news</strong>
          <small>Veille intelligence artificielle</small>
        </span>
      </RouterLink>

      <button class="icon-button" type="button" :aria-label="themeLabel" :title="themeLabel" @click="darkMode = !darkMode">
        <Sun v-if="darkMode" :size="19" />
        <Moon v-else :size="19" />
      </button>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
