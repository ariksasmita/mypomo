<template>
  <div class="backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl border border-white/20 w-96 flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <span class="text-white/60 text-sm font-medium tracking-widest uppercase">Statistics</span>
      <div class="flex gap-2">
        <button @click="refreshStats" class="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200" title="Refresh">
          <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
        <button @click="exportData" class="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200" title="Export JSON">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto space-y-6">
      <section v-if="categoryStats.length > 0">
        <h3 class="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Category Stats</h3>
        <div class="space-y-3">
          <div v-for="stats in categoryStats" :key="stats.category" class="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white font-medium">{{ stats.category }}</span>
              <span class="text-white/60 text-sm">{{ formatTime(stats.totalTime) }}</span>
            </div>
            <div class="flex gap-4 text-xs">
              <span class="text-violet-300">
                {{ stats.focusSessions }} focus
              </span>
              <span class="text-emerald-300">
                {{ stats.restSessions }} rest
              </span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="sessions.length > 0">
        <h3 class="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Recent Sessions</h3>
        <div class="space-y-3">
          <div v-for="session in sessions" :key="session.id" class="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1 min-w-0">
                <h4 class="text-white font-medium truncate">{{ session.title || 'Untitled' }}</h4>
                <p class="text-white/50 text-xs truncate mt-1">{{ session.category }}</p>
              </div>
              <span class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full shrink-0" :class="session.mode === 'focus' ? 'bg-violet-500/20 text-violet-200' : 'bg-emerald-500/20 text-emerald-200'">
                {{ session.mode }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs text-white/40">
              <span>{{ formatTime(session.duration) }}</span>
              <span>{{ formatRelativeTime(session.startTime) }}</span>
            </div>
          </div>
        </div>
        <button v-if="hasMoreSessions" @click="loadMore" class="mt-4 w-full py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm font-medium">
          Load More
        </button>
      </section>

      <section v-if="categoryStats.length === 0 && sessions.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-white/40 text-sm">No sessions yet...</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PomodoroDB from '../utils/indexedDB'
import type { CategoryStats, Session } from '../types'

const categoryStats = ref<CategoryStats[]>([])
const sessions = ref<Session[]>([])
const totalSessions = ref(0)
const currentPage = ref(1)
const sessionsPerPage = 3
const isRefreshing = ref(false)

const hasMoreSessions = computed(() => 
  currentPage.value * sessionsPerPage < totalSessions.value
)

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const refreshStats = async () => {
  isRefreshing.value = true
  try {
    const [stats, allSessions, totalCount] = await Promise.all([
      PomodoroDB.getAllCategoryStats(),
      PomodoroDB.getRecentSessions(sessionsPerPage, 0),
      PomodoroDB.getSessionCount()
    ])
    categoryStats.value = stats
    sessions.value = allSessions
    totalSessions.value = totalCount
    currentPage.value = 1
  } catch (error) {
    console.error('Failed to refresh stats:', error)
  } finally {
    isRefreshing.value = false
  }
}

const loadMore = async () => {
  currentPage.value++
  const newSessions = await PomodoroDB.getRecentSessions(
    sessionsPerPage * currentPage.value,
    0
  )
  sessions.value = newSessions
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
