<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

        <div class="relative w-full max-w-md bg-surface-container border border-outline-variant/10 rounded-lg shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
            <h2 class="font-display text-lg font-semibold text-tertiary">Keyboard Shortcuts</h2>
            <button @click="$emit('close')" class="text-on-surface-variant/60 hover:text-tertiary transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            <div v-for="group in groupedShortcuts" :key="group.category">
              <h3 class="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">{{ group.category }}</h3>
              <div class="space-y-2">
                <div
                  v-for="s in group.shortcuts"
                  :key="s.key"
                  class="flex items-center justify-between"
                >
                  <span class="font-body text-sm text-on-surface">{{ s.label }}</span>
                  <kbd class="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/20 font-body text-xs text-on-surface-variant min-w-[2.5rem] text-center">{{ s.key }}</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SHORTCUTS } from '../composables/useKeyboardShortcuts'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const groupedShortcuts = computed(() => {
  const groups: Record<string, { category: string; shortcuts: typeof SHORTCUTS }> = {}
  for (const s of SHORTCUTS) {
    if (!groups[s.category]) {
      groups[s.category] = { category: s.category, shortcuts: [] }
    }
    groups[s.category].shortcuts.push(s)
  }
  return Object.values(groups)
})
</script>
