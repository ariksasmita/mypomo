<script setup lang="ts">
import { ref, computed } from 'vue'
import Timer from './components/Timer.vue'
import SessionDetails from './components/SessionDetails.vue'
import Stats from './components/Stats.vue'

const timerRef = ref()
const statsRef = ref()

const streakText = computed(() => {
  const count = timerRef.value?.streakCount?.value || 0
  return `Streak: ${count}`
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-12 bg-surface relative">
    <div class="grain-overlay"></div>
    
    <header class="fixed top-0 z-50 w-full flex justify-between items-center px-12 h-16 bg-gradient-to-b from-surface to-transparent">
      <div class="flex items-center gap-4">
        <span class="font-display font-bold tracking-[0.2em] text-tertiary">CHRONO_CORE</span>
        <div class="px-2 py-0.5 rounded-full bg-secondary-container/30 border border-outline-variant/10">
          <span class="font-headline text-[10px] uppercase tracking-widest text-primary-dim">v.01-ALPHA</span>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <button class="material-symbols-outlined text-primary/60 hover:text-tertiary transition-colors">account_circle</button>
        <button class="material-symbols-outlined text-primary/60 hover:text-tertiary transition-colors">settings</button>
      </div>
    </header>

    <main class="flex-1 p-12 overflow-y-auto pt-20 w-full max-w-5xl">
      <div class="tech-trace"></div>
      <div class="space-y-12 relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div class="staggered-header">
            <h1 class="font-display text-5xl font-bold tracking-tighter text-tertiary">SESSION_CORE</h1>
            <p class="font-body text-on-surface-variant mt-2 max-w-xs">Restrained productivity interface designed for deep cognitive focus.</p>
          </div>
          <div class="flex gap-2">
            <span class="px-3 py-1 rounded-full bg-secondary-container/50 border border-outline-variant/20 font-headline text-[10px] uppercase tracking-widest text-primary-dim">{{ streakText }}</span>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-8">
          <Timer ref="timerRef" @session-saved="statsRef?.refreshStats()" :class="timerRef?.isRunning ? 'col-span-12' : 'col-span-12 lg:col-span-7'" />
          <SessionDetails 
            v-if="timerRef && !timerRef.isRunning"
            v-model:taskTitle="timerRef.taskTitle"
            v-model:taskDescription="timerRef.taskDescription"
            v-model:taskCategory="timerRef.taskCategory"
            v-model:isRunning="timerRef.isRunning"
            class="col-span-12 lg:col-span-5"
          />
          <Stats ref="statsRef" class="col-span-12" />
        </div>
      </div>
    </main>

    <div class="fixed bottom-12 right-12 opacity-5 pointer-events-none select-none">
      <div class="font-display font-bold text-[120px] text-primary/20 leading-none tracking-tighter">00:00</div>
    </div>
  </div>
</template>
