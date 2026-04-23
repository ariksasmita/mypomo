<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-headline text-xs uppercase tracking-widest text-secondary">Duration Presets</h3>
      <button
        @click="addPreset"
        class="px-3 py-1 rounded font-headline text-[10px] uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        + Add Preset
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="(preset, index) in localPresets"
        :key="index"
        class="flex items-center gap-3 bg-surface-container-lowest rounded p-3 group"
      >
        <button
          @click="setDefault(index)"
          :class="preset.minutes === defaultPreset ? 'text-focus' : 'text-on-surface-variant/30 hover:text-on-surface-variant'"
          class="transition-colors"
          :title="preset.minutes === defaultPreset ? 'Default' : 'Set as default'"
        >
          <span class="material-symbols-outlined text-lg">{{ preset.minutes === defaultPreset ? 'star' : 'star_border' }}</span>
        </button>

        <input
          v-model.number="preset.minutes"
          type="number"
          min="1"
          max="120"
          class="w-16 bg-surface-container-high border-none rounded px-3 py-2 text-center text-on-surface text-sm focus:ring-1 focus:ring-primary/40"
        />
        <span class="text-on-surface-variant text-xs font-headline uppercase tracking-wider">min</span>

        <input
          v-model="preset.label"
          type="text"
          class="flex-1 bg-surface-container-high border-none rounded px-3 py-2 text-on-surface text-sm focus:ring-1 focus:ring-primary/40"
          placeholder="Label"
        />

        <button
          @click="removePreset(index)"
          class="opacity-0 group-hover:opacity-100 text-on-surface-variant/40 hover:text-red-400 transition-all"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>

    <div v-if="hasChanges" class="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
      <button @click="discardChanges" class="px-4 py-2 rounded font-headline text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Discard</button>
      <button @click="saveChanges" class="px-4 py-2 rounded font-headline text-[10px] uppercase tracking-widest bg-primary text-on-primary hover:opacity-90 transition-opacity">Save Presets</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PresetConfig } from '../../types'

const props = defineProps<{
  presets: PresetConfig[]
  defaultPreset: number
}>()

const emit = defineEmits<{
  save: [presets: PresetConfig[], defaultPreset: number]
}>()

const localPresets = ref<PresetConfig[]>(JSON.parse(JSON.stringify(props.presets)))
const defaultPreset = ref(props.defaultPreset)
const hasChanges = ref(false)

watch(() => [localPresets.value, defaultPreset.value], () => {
  hasChanges.value = true
}, { deep: true })

watch(() => props.presets, (newVal) => {
  localPresets.value = JSON.parse(JSON.stringify(newVal))
  hasChanges.value = false
}, { deep: true })

watch(() => props.defaultPreset, (newVal) => {
  defaultPreset.value = newVal
})

const addPreset = () => {
  const mins = 15
  localPresets.value.push({ minutes: mins, label: `${mins}m` })
}

const removePreset = (index: number) => {
  if (localPresets.value.length <= 1) return
  const removed = localPresets.value.splice(index, 1)[0]
  if (removed.minutes === defaultPreset.value && localPresets.value.length > 0) {
    defaultPreset.value = localPresets.value[0].minutes
  }
}

const setDefault = (index: number) => {
  defaultPreset.value = localPresets.value[index].minutes
}

const saveChanges = () => {
  emit('save', JSON.parse(JSON.stringify(localPresets.value)), defaultPreset.value)
  hasChanges.value = false
}

const discardChanges = () => {
  localPresets.value = JSON.parse(JSON.stringify(props.presets))
  defaultPreset.value = props.defaultPreset
  hasChanges.value = false
}
</script>
