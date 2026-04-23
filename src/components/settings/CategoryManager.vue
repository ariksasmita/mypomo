<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-headline text-xs uppercase tracking-widest text-secondary">Categories</h3>
      <button
        @click="addCategory"
        class="px-3 py-1 rounded font-headline text-[10px] uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        + Add Category
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="(_cat, index) in localCategories"
        :key="index"
        class="flex items-center gap-3 bg-surface-container-lowest rounded p-3 group"
      >
        <span class="w-2 h-2 rounded-full bg-focus/60 shrink-0"></span>

        <input
          v-model="localCategories[index]"
          type="text"
          class="flex-1 bg-surface-container-high border-none rounded px-3 py-2 text-on-surface text-sm focus:ring-1 focus:ring-primary/40"
        />

        <button
          @click="removeCategory(index)"
          class="opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-red-400 transition-all"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>

    <div v-if="hasChanges" class="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
      <button @click="discardChanges" class="px-4 py-2 rounded font-headline text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Discard</button>
      <button @click="saveChanges" class="px-4 py-2 rounded font-headline text-[10px] uppercase tracking-widest bg-primary text-on-primary hover:opacity-90 transition-opacity">Save Categories</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  categories: string[]
}>()

const emit = defineEmits<{
  save: [categories: string[]]
}>()

const localCategories = ref<string[]>([...props.categories])
const hasChanges = ref(false)

watch(() => localCategories.value, () => {
  hasChanges.value = true
}, { deep: true })

watch(() => props.categories, (newVal) => {
  localCategories.value = [...newVal]
  hasChanges.value = false
}, { deep: true })

const addCategory = () => {
  localCategories.value.push('')
}

const removeCategory = (index: number) => {
  if (localCategories.value.length <= 1) return
  localCategories.value.splice(index, 1)
}

const saveChanges = () => {
  const cleaned = localCategories.value.map(c => c.trim()).filter(c => c.length > 0)
  emit('save', cleaned)
  hasChanges.value = false
}

const discardChanges = () => {
  localCategories.value = [...props.categories]
  hasChanges.value = false
}
</script>
