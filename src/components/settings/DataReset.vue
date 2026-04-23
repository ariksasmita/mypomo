<template>
  <div class="space-y-6">
    <h3 class="font-headline text-xs uppercase tracking-widest text-secondary mb-4">Data Management</h3>

    <div class="bg-surface-container-lowest rounded p-6 space-y-4">
      <div class="flex items-start gap-4">
        <span class="material-symbols-outlined text-red-400/60 text-2xl">warning</span>
        <div>
          <p class="text-on-surface text-sm font-body mb-1">Reset All Data</p>
          <p class="text-on-surface-variant text-xs font-body">This will permanently delete all sessions, categories, stats, and settings. This action cannot be undone.</p>
        </div>
      </div>

      <div v-if="confirmStep === 0">
        <button
          @click="confirmStep = 1"
          class="w-full px-4 py-3 rounded font-headline text-[10px] uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
        >
          Reset Database
        </button>
      </div>

      <div v-else-if="confirmStep === 1" class="space-y-3">
        <p class="text-red-400 text-sm font-body">Are you sure? Click again to confirm.</p>
        <div class="flex gap-3">
          <button
            @click="confirmStep = 2"
            class="flex-1 px-4 py-3 rounded font-headline text-[10px] uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
          >
            Yes, Delete Everything
          </button>
          <button
            @click="confirmStep = 0"
            class="px-4 py-3 rounded font-headline text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div v-else class="space-y-3">
        <p class="text-red-400 text-sm font-body font-semibold">Type "RESET" to confirm:</p>
        <input
          v-model="confirmText"
          type="text"
          class="w-full bg-surface-container-high border border-red-500/20 rounded px-4 py-3 text-on-surface text-sm focus:ring-1 focus:ring-red-400/40"
          placeholder="RESET"
          @keyup.enter="executeReset"
        />
        <div class="flex gap-3">
          <button
            @click="executeReset"
            :disabled="confirmText !== 'RESET'"
            class="flex-1 px-4 py-3 rounded font-headline text-[10px] uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Permanently Delete
          </button>
          <button
            @click="cancelReset"
            class="px-4 py-3 rounded font-headline text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div v-if="resetStatus" class="text-sm font-body py-2" :class="resetStatus === 'success' ? 'text-rest' : 'text-red-400'">
        {{ resetStatus === 'success' ? 'Database reset successfully. Reloading...' : 'Failed to reset database. Please try again.' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PomodoroDB from '../../utils/indexedDB'

const emit = defineEmits<{
  reset: []
}>()

const confirmStep = ref(0)
const confirmText = ref('')
const resetStatus = ref<'success' | 'error' | ''>('')

const executeReset = async () => {
  if (confirmText.value !== 'RESET') return
  try {
    await PomodoroDB.resetDatabase()
    resetStatus.value = 'success'
    emit('reset')
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch {
    resetStatus.value = 'error'
  }
}

const cancelReset = () => {
  confirmStep.value = 0
  confirmText.value = ''
  resetStatus.value = ''
}
</script>
