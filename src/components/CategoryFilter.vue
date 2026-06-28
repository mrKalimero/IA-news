<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
  },
  active: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="category-filter" aria-label="Filtrer par categorie">
    <button
      v-for="category in categories"
      :key="category"
      class="chip"
      :class="{ active: category === active }"
      type="button"
      @click="emit('select', category)"
    >
      {{ category }}
    </button>
  </div>
</template>
