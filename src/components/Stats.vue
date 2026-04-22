<template>
  <div class="glass-surface rounded-lg p-6 flex flex-col h-full">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium tracking-widest uppercase text-[var(--color-on-surface-variant)]">Statistics</span>
      <div class="flex gap-2">
        <button @click="toggleExpanded" class="flex items-center justify-center p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:surface-container-high rounded-full transition-all duration-200" title="Toggle">
          <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#ffffff"></path> </g>
          </svg>
        </button>
        <button @click="refreshStats" class="flex items-center justify-center p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:surface-container-high rounded-full transition-all duration-200" title="Refresh">
          <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 1.29289C14.0976 1.68342 14.0976 2.31658 13.7071 2.70711L12.4053 4.00896C17.1877 4.22089 21 8.16524 21 13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13C3 12.4477 3.44772 12 4 12C4.55228 12 5 12.4477 5 13C5 16.866 8.13401 20 12 20C15.866 20 19 16.866 19 13C19 9.2774 16.0942 6.23349 12.427 6.01281L13.7071 7.29289C14.0976 7.68342 14.0976 8.31658 13.7071 8.70711C13.3166 9.09763 12.6834 9.09763 12.2929 8.70711L9.29289 5.70711C9.10536 5.51957 9 5.26522 9 5C9 4.73478 9.10536 4.48043 9.29289 4.29289L12.2929 1.29289C12.6834 0.902369 13.3166 0.902369 13.7071 1.29289Z" fill="#ffffff"></path> </g>
          </svg>
        </button>
        <button @click="exportData" class="flex items-center justify-center p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:surface-container-high rounded-full transition-all duration-200" title="Export JSON">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#ffffff"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#ffffff"></path> </g>
          </svg>
        </button>
      </div>
    </div>

    <transition name="stats-expand">
      <div v-show="isExpanded" class="flex-1 overflow-y-auto space-y-6 mt-6">
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
