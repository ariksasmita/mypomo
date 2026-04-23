<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <div class="relative w-full max-w-lg bg-surface-container border border-outline-variant/10 rounded-lg shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
            <h2 class="font-display text-lg font-semibold text-tertiary">Settings</h2>
            <button @click="$emit('close')" class="text-on-surface-variant/60 hover:text-tertiary transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex border-b border-outline-variant/10">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="activeTab === tab.id ? 'text-primary border-primary' : 'text-on-surface-variant/50 border-transparent hover:text-on-surface-variant'"
              class="flex-1 px-4 py-3 font-headline text-[10px] uppercase tracking-widest transition-colors border-b-2"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="p-6 max-h-[60vh] overflow-y-auto">
            <div v-if="saveFeedback" class="mb-4 px-4 py-2 rounded bg-rest/10 border border-rest/20 text-rest text-sm font-body">{{ saveFeedback }}</div>
            <TimerPresets
              v-if="activeTab === 'timer'"
              :presets="config.presets"
              :default-preset="config.defaultPreset"
              @save="savePresets"
            />
            <CategoryManager
              v-if="activeTab === 'categories'"
              :categories="config.categories"
              @save="saveCategories"
            />
            <DataReset
              v-if="activeTab === 'data'"
              @reset="$emit('close')"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import PomodoroDB from '../utils/indexedDB'
import type { AppConfig, PresetConfig } from '../types'
import { DEFAULT_CONFIG } from '../types'
import TimerPresets from './settings/TimerPresets.vue'
import CategoryManager from './settings/CategoryManager.vue'
import DataReset from './settings/DataReset.vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  configSaved: []
}>()

const activeTab = ref<'timer' | 'categories' | 'data'>('timer')

const tabs = [
  { id: 'timer' as const, label: 'Timer' },
  { id: 'categories' as const, label: 'Categories' },
  { id: 'data' as const, label: 'Data' },
]

const config = ref<AppConfig>({ ...DEFAULT_CONFIG })
const saveFeedback = ref('')

onMounted(async () => {
  try {
    config.value = await PomodoroDB.getConfig()
  } catch {
    config.value = { ...DEFAULT_CONFIG }
  }
})

watch(() => saveFeedback.value, (val) => {
  if (val) setTimeout(() => { saveFeedback.value = '' }, 2000)
})

const savePresets = async (presets: PresetConfig[], defaultPreset: number) => {
  config.value.presets = presets
  config.value.defaultPreset = defaultPreset
  await PomodoroDB.saveConfig(config.value)
  saveFeedback.value = 'Presets saved'
  emit('configSaved')
}

const saveCategories = async (categories: string[]) => {
  config.value.categories = categories
  await PomodoroDB.saveConfig(config.value)
  saveFeedback.value = 'Categories saved'
  emit('configSaved')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
