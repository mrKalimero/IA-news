<script setup>
import { Search } from '@lucide/vue'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="search-box">
    <Search :size="18" />
    <input
      :value="modelValue"
      type="search"
      placeholder="Rechercher une actualite, un tag, une source..."
      @input="emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>
