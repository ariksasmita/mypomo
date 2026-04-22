<template>
  <div class="flex-1">
    <div class="glass-surface rounded-lg p-8 relative">
      <div class="text-center">
        <div class="mb-6">
          <span class="text-sm font-medium tracking-widest uppercase text-[var(--color-on-surface-variant)]">Pomodoro Timer</span>
        </div>
        <div class="flex justify-center gap-3 mb-8">
          <button
            @click="mode = 'focus'"
            :class="mode === 'focus' ? 'bg-[#d4a373] text-[#1e293b]' : 'surface-container-high text-[var(--color-on-surface)] hover:text-[#d4a373] hover:surface-container-highest'"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ghost-border-subtle hover:ghost-border"
          >
            FOCUS
          </button>
          <button
            @click="mode = 'rest'"
            :class="mode === 'rest' ? 'bg-[#6abf69] text-[#1e293b]' : 'surface-container-high text-[var(--color-on-surface)] hover:text-[#6abf69] hover:surface-container-highest'"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ghost-border-subtle hover:ghost-border"
          >
            REST
          </button>
        </div>
        <div class="text-display text-[5rem] font-semibold mb-8 tracking-tight" :class="mode === 'focus' ? 'text-[#d4a373]' : 'text-[#6abf69]'">{{timeString}}</div>

        <transition name="content-fade" mode="out-in">
          <div v-if="!isRunning" key="setup" class="text-center">
            <button
              @click="buttonHandler"
              :style="mode === 'focus'
                ? 'background: linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-dim) 100%)'
                : 'background: linear-gradient(145deg, var(--color-primary-dim) 0%, var(--color-primary) 100%)'"
              class="px-8 py-3 text-[var(--color-on-primary)] font-medium rounded-[var(--radius-md)] transition-all duration-300 transform hover:scale-105 active:scale-95 mb-6 hover:shadow-lg"
            >
              {{buttonText}}
            </button>
            <div class="flex justify-center gap-3 mb-8">
              <button @click="setPreset(5)" class="px-5 py-2 surface-container-high text-[var(--color-on-surface-variant)] text-sm font-medium rounded-[var(--radius-md)] hover:text-[var(--color-on-surface)] ghost-border-subtle hover:ghost-border transition-all duration-200">
                5m
              </button>
              <button @click="setPreset(10)" class="px-5 py-2 surface-container-high text-[var(--color-on-surface-variant)] text-sm font-medium rounded-[var(--radius-md)] hover:text-[var(--color-on-surface)] ghost-border-subtle hover:ghost-border transition-all duration-200">
                10m
              </button>
              <button @click="setPreset(25)" class="px-5 py-2 surface-container-high text-[var(--color-on-surface-variant)] text-sm font-medium rounded-[var(--radius-md)] hover:text-[var(--color-on-surface)] ghost-border-subtle hover:ghost-border transition-all duration-200">
                25m
              </button>
              <button @click="toggleCustom" :class="showCustom ? 'surface-container-highest text-[var(--color-on-surface)]' : 'surface-container-high text-[var(--color-on-surface-variant)]'" class="px-5 py-2 text-[var(--color-on-surface-variant)] text-sm font-medium rounded-[var(--radius-md)] hover:text-[var(--color-on-surface)] ghost-border-subtle hover:ghost-border transition-all duration-200">
                Custom
              </button>
            </div>
            <div v-show="showCustom" class="mt-8 flex items-center justify-center gap-4">
              <div class="relative">
                <input type="number" min="0" max="60" v-model="minInput" placeholder="00" class="w-24 surface-container-lowest rounded-[var(--radius-sm)] px-4 py-3 text-center text-xl text-[var(--color-on-surface)] text-mono focus:outline-none transition-all duration-200 placeholder:text-[var(--color-on-surface-variant)] hover:surface-container-low">
                <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">min</span>
              </div>
              <span class="text-[var(--color-on-surface-variant)] text-2xl font-light">:</span>
              <div class="relative">
                <input type="number" min="0" max="60" v-model="secInput" placeholder="00" class="w-24 surface-container-lowest rounded-[var(--radius-sm)] px-4 py-3 text-center text-xl text-[var(--color-on-surface)] text-mono focus:outline-none transition-all duration-200 placeholder:text-[var(--color-on-surface-variant)] hover:surface-container-low">
                <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wide text-[var(--color-on-surface-variant)]">sec</span>
              </div>
            </div>
          </div>
          <div v-else key="running" class="text-center">
            <div v-if="taskTitle" class="mb-6">
              <h2 class="text-display text-2xl font-semibold text-[var(--color-tertiary)] mb-3">{{taskTitle}}</h2>
              <div v-if="taskCategory" class="inline-block px-3 py-1 mb-3 rounded-full text-sm font-medium surface-container-high" :class="mode === 'focus' ? 'text-[#1e293b] bg-[#d4a373]/15' : 'text-[#1e293b] bg-[#6abf69]/15'">
                {{taskCategory}}
              </div>
              <p v-if="taskDescription" class="text-body text-[var(--color-on-surface-variant)] text-lg leading-relaxed">{{taskDescription}}</p>
            </div>
            <button
              @click="buttonHandler"
              :style="mode === 'focus'
                ? 'background: linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-dim) 100%)'
                : 'background: linear-gradient(145deg, var(--color-primary-dim) 0%, var(--color-primary) 100%)'"
              class="px-8 py-3 text-[var(--color-on-primary)] font-medium rounded-[var(--radius-md)] transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              {{buttonText}}
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-fade-enter-active,
.content-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<script setup lang="ts">
  import { ref, onUnmounted, computed } from 'vue'
  import PomodoroDB from '../utils/indexedDB'
  import type { Session } from '../types'

  defineEmits(['sessionSaved'])

  const minutes = ref(0)
  const seconds = ref(0)
  const minInput = ref(0)
  const secInput = ref(0)
  const showCustom = ref(false)
  const taskTitle = ref('')
  const taskDescription = ref('')
  const taskCategory = ref('')
  const isRunning = ref(false)
  const mode = ref<'focus' | 'rest'>('focus')
  const sessionStartTime = ref(0)
  const buttonText = ref('Start')
  let interv: any

  defineExpose({
    taskTitle,
    taskDescription,
    taskCategory,
    isRunning
  })

  const timeString = computed(() => {
    const min = minutes.value < 10 ? `0${minutes.value.toString()}` : minutes.value.toString()
    const sec = seconds.value < 10 ? `0${seconds.value.toString()}` : seconds.value.toString()
    return `${min}:${sec}`
  })

  const updateTime = () => {
    if (minutes.value > 0 && seconds.value === 0) {
      minutes.value = minutes.value - 1
      seconds.value = 59
      return
    }

    if (seconds.value > 0) {
      seconds.value = seconds.value - 1
    } else {
      stopTimer()
    }
  }

  const buttonHandler = () => {
    !interv ? startTimer() : stopTimer()
  }

  const setPreset = (mins: number) => {
    minutes.value = mins
    seconds.value = 0
    showCustom.value = false
  }

  const toggleCustom = () => {
    showCustom.value = !showCustom.value
  }

  const startTimer = () => {
    if (interv) return
    if (showCustom.value) {
      if (minInput.value) minutes.value = minInput.value
      if (secInput.value) seconds.value = secInput.value
    }
    sessionStartTime.value = Date.now()
    buttonText.value = 'Stop'
    isRunning.value = true
    interv = setInterval(() => {
      updateTime()
    }, 1000);
  }

  const stopTimer = async () => {
    if (!interv) return
    clearInterval(interv)
    
    const endTime = Date.now()
    const duration = Math.floor((endTime - sessionStartTime.value) / 1000)

    const now = new Date()
    const dateStr = now.toLocaleDateString()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const session: Session = {
      title: taskTitle.value || `Session ${dateStr} - ${timeStr}`,
      category: taskCategory.value || 'Main',
      description: taskDescription.value,
      mode: mode.value,
      duration,
      startTime: sessionStartTime.value,
      endTime
    }

    await PomodoroDB.saveSession(session)
    
    isRunning.value = false
    resetTimer()
  }

  const resetTimer = () => {
    minutes.value = 0
    seconds.value = 0
    buttonText.value = 'Start'
    interv = null
  }

  onUnmounted(() => {
    stopTimer()
  })
</script>
