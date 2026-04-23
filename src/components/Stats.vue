<template>
  <div class="space-y-6">
    <section class="space-y-6">
      <div class="flex items-center gap-4">
        <h2 class="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Telemetry_Data</h2>
        <div class="flex-1 h-px bg-outline-variant/10"></div>
        <div class="flex gap-4">
          <button @click="refreshStats" class="material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface text-sm" :class="{ 'animate-spin': isRefreshing }">refresh</button>
          <button @click="exportData" class="material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface text-sm">download</button>
        </div>
      </div>
      
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-3 bg-surface-container-low p-6 rounded-lg border border-outline-variant/5">
          <div class="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-1">Total_Focus</div>
          <div class="text-3xl font-headline text-tertiary">{{ formatTotalTime() }}<span class="text-sm text-secondary ml-1">HRS</span></div>
        </div>
        
        <div class="col-span-12 md:col-span-9 space-y-2">
          <div class="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-2 px-2">Category_Stats</div>
          <div class="space-y-1">
            <div v-for="stats in categoryStats" :key="stats.category" class="bg-surface-container-low/50 border border-outline-variant/5 p-4 rounded-lg flex justify-between items-center group hover:bg-surface-container-low transition-colors">
              <div class="flex flex-col">
                <span class="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">{{ stats.category }}</span>
                <div class="flex gap-4 text-[10px] text-secondary font-body">
                  <span>{{ stats.focusSessions }} focus</span>
                  <span>{{ stats.restSessions }} rest</span>
                </div>
              </div>
              <div class="font-headline text-lg text-primary">{{ formatTime(stats.totalTime) }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex items-center gap-4">
        <h3 class="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Recent_Sessions</h3>
        <div class="flex-1 h-px bg-outline-variant/10"></div>
      </div>
      
      <div class="space-y-3">
        <div v-for="session in sessions" :key="session.id" class="bg-surface-container-low p-5 rounded-lg border border-outline-variant/5 flex justify-between items-start">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="font-headline text-sm text-tertiary">{{ session.title || `Session ${formatTimestamp(session.startTime)}` }}</span>
              <span class="px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20 text-[9px] uppercase tracking-widest text-primary">{{ session.mode }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant">{{ session.category }}</span>
              <span class="text-[10px] font-body text-secondary">{{ formatTime(session.duration) }} duration</span>
            </div>
          </div>
          <div class="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant/60">{{ formatRelativeTime(session.startTime) }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PomodoroDB from '../utils/indexedDB'
import type { CategoryStats, Session } from '../types'

const categoryStats = ref<CategoryStats[]>([])
const sessions = ref<Session[]>([])
const isRefreshing = ref(false)

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

const formatTotalTime = (): string => {
  const totalFocus = categoryStats.value.reduce((acc, stat) => acc + stat.totalTime, 0)
  const h = Math.floor(totalFocus / 3600)
  const m = Math.floor((totalFocus % 3600) / 60)
  
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}`
  return `0:${m.toString().padStart(2, '0')}`
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const dateStr = date.toLocaleDateString()
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${dateStr} - ${timeStr}`
}

const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return `${seconds}m ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const refreshStats = async () => {
  isRefreshing.value = true
  try {
    const [stats, allSessions] = await Promise.all([
      PomodoroDB.getAllCategoryStats(),
      PomodoroDB.getRecentSessions(3, 0)
    ])
    categoryStats.value = stats
    sessions.value = allSessions
  } catch (error) {
    console.error('Failed to refresh stats:', error)
  } finally {
    isRefreshing.value = false
  }
}

const exportData = async () => {
  try {
    const blob = await PomodoroDB.exportToJSON()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mypomo-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export data:', error)
  }
}

onMounted(() => {
  refreshStats()
})

defineExpose({
  refreshStats
})
</script>

<style scoped>
</style>
