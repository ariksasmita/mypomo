<script setup lang="ts">
import { ref } from 'vue'
import Timer from './components/Timer.vue'
import Stats from './components/Stats.vue'

const statsRef = ref()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-8">
    <div class="flex gap-6 w-full max-w-6xl items-stretch">
      <Timer @session-saved="statsRef?.refreshStats()" />
      <Stats ref="statsRef" />
    </div>
  </div>
</template>
