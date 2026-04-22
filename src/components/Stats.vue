<template>
  <div class="glass-surface rounded-lg p-6 flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <span class="text-sm font-medium tracking-widest uppercase text-[var(--color-on-surface-variant)]">Statistics</span>
      <div class="flex gap-2">
        <button @click="toggleExpanded" class="flex items-center justify-center p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:surface-container-high rounded-full transition-all duration-200" title="Toggle">
          <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <button @click="refreshStats" class="flex items-center justify-center p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:surface-container-high rounded-full transition-all duration-200" title="Refresh">
          <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 4v6a3 3 0 01 6m-1.006a3 3 0 00-10m14 0 4v4"></path>
          </svg>
        </button>
        <button @click="exportData" class="flex items-center justify-center p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:surface-container-high rounded-full transition-all duration-200" title="Export JSON">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v-4a1 1 0 01-4v6.01a9 9v9.3 1 0 1-.06 0 2.93a9 9v-15.097c5.83 0 3 0 3h3.9 3v15.097c5.83 0 6 6 6.5 7 11.5v15.097c5.83-4a1 1 0 0 1"></path>
          </svg>
        </button>
      </div>
    </div>

    <transition name="stats-expand">
      <div v-show="isExpanded" class="flex-1 overflow-y-auto space-y-6">
        <section v-if="categoryStats.length > 0">
          <h3 class="text-xs font-semibold uppercase tracking-wider mb-3 text-[var(--color-on-surface-variant)]">Category Stats</h3>
          <div class="space-y-3">
            <div v-for="stats in categoryStats" :key="stats.category" class="surface-container-low rounded-[var(--radius-lg)] p-4 hover:surface-container-lowest transition-all duration-200">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-[var(--color-on-surface)]">{{ stats.category }}</span>
                <span class="text-sm text-[var(--color-on-surface-variant)]">{{ formatTime(stats.totalTime) }}</span>
              </div>
              <div class="flex gap-4 text-xs">
                <span class="text-[var(--color-on-surface-variant)]">
                  {{ stats.focusSessions }} focus
                </span>
                <span class="text-[var(--color-on-surface-variant)]">
                  {{ stats.restSessions }} rest
                </span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="sessions.length > 0">
          <h3 class="text-xs font-semibold uppercase tracking-wider mb-3 text-[var(--color-on-surface-variant)]">Recent Sessions</h3>
          <div class="space-y-3">
            <div v-for="session in sessions" :key="session.id" class="surface-container-low rounded-[var(--radius-lg)] p-4 hover:surface-container-lowest transition-all duration-200">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-[var(--color-on-surface)] truncate">{{ session.title || 'Untitled' }}</h4>
                  <p class="text-xs text-[var(--color-on-surface-variant)] truncate mt-1">{{ session.category }}</p>
                </div>
                <span class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full shrink-0 surface-container-high" :class="session.mode === 'focus' ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface)]'">
                  {{ session.mode }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-[var(--color-on-surface-variant)]">
                <span>{{ formatTime(session.duration) }}</span>
                <span>{{ formatRelativeTime(session.startTime) }}</span>
              </div>
            </div>
            <button v-if="hasMoreSessions" @click="loadMore" class="mt-4 w-full py-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:surface-container-low rounded-[var(--radius-lg)] transition-all duration-200 text-sm font-medium">
              Load More
            </button>
          </div>
        </section>

        <section v-if="categoryStats.length === 0 && sessions.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-[var(--color-on-surface-variant)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm text-[var(--color-on-surface-variant)]">No sessions yet...</p>
        </section>
      </div>
    </transition>
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
const isExpanded = ref(true)

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

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
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
  refreshStats,
  toggleExpanded
})
</script>

<style scoped>
.stats-expand-enter-active,
.stats-expand-leave-active {
  transition: all 0.4s ease-in-out;
}

.stats-expand-enter-from {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.stats-expand-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
</style>
