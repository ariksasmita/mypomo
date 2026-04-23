<template>
  <div class="bg-surface-container-low rounded-lg p-12 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl group shadow-sm border border-outline-variant/5">
    <div class="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style="background-image: radial-gradient(var(--color-primary) 1px, transparent 1px); background-size: 24px 24px;"></div>
    <div class="z-10 flex flex-col items-center w-full mb-8">
      <div class="text-[10px] font-headline uppercase tracking-[0.3em] text-on-surface-variant mb-4">POMODORO_TIMER</div>
      
      <div v-if="isRunning && (taskTitle || taskCategory || taskDescription)" class="text-center mb-8 max-w-lg">
        <h2 v-if="taskTitle" class="font-display text-2xl font-semibold text-tertiary mb-3">{{taskTitle}}</h2>
        <div v-if="taskCategory" class="inline-block px-3 py-1 mb-3 rounded-full text-sm font-medium text-on-primary" :class="mode === 'focus' ? 'bg-focus/10 border-focus/20 text-focus' : 'bg-rest/10 border-rest/20 text-rest'">
          {{taskCategory}}
        </div>
        <p v-if="taskDescription" class="font-body text-on-surface-variant text-lg leading-relaxed">{{taskDescription}}</p>
      </div>
      
      <div class="text-[120px] md:text-[160px] font-bold leading-none mb-8" :class="mode === 'focus' ? 'text-focus-gradient' : 'text-rest-gradient'">{{timeString}}</div>
      
      <div class="flex gap-6 items-center">
        <button
          @click="buttonHandler"
          class="w-20 h-20 rounded-full border border-primary/20 flex items-center justify-center group/btn hover:bg-primary transition-all duration-300"
        >
          <span class="material-symbols-outlined text-primary group-hover/btn:text-on-primary text-4xl" style="font-variation-settings: 'FILL' 1;">
            {{ isRunning ? 'pause' : 'play_arrow' }}
          </span>
        </button>
        <button @click="resetTimer" class="w-14 h-14 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-secondary text-2xl">refresh</span>
        </button>
      </div>
      
      <div class="mt-12 flex gap-3">
        <button
          v-for="preset in presets"
          :key="preset.minutes"
          @click="setPreset(preset.minutes)"
          :class="activePreset === preset.minutes ? 'bg-primary border border-primary text-on-primary' : 'surface-container-high border border-outline-variant/10 text-on-surface-variant hover:text-primary'"
          class="px-4 py-1.5 rounded font-headline text-[10px] uppercase tracking-widest transition-colors"
        >{{ preset.label }}</button>
        <button @click="toggleCustom" :class="showCustom ? 'bg-primary border border-primary text-on-primary' : 'surface-container-high border border-outline-variant/10 text-on-surface-variant hover:text-primary'" class="px-4 py-1.5 rounded font-headline text-[10px] uppercase tracking-widest transition-colors">Custom</button>
      </div>
      
      <div v-if="showCustom" class="mt-8 mb-8 flex items-center justify-center gap-4">
        <div class="relative">
          <input type="number" min="0" max="60" v-model="minInput" placeholder="00" class="w-24 surface-container-lowest border-none rounded px-4 py-3 text-center text-xl text-on-surface font-body text-mono focus:ring-1 focus:ring-primary/40">
          <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wide text-on-surface-variant">min</span>
        </div>
        <span class="text-on-surface-variant text-2xl font-light">:</span>
        <div class="relative">
          <input type="number" min="0" max="60" v-model="secInput" placeholder="00" class="w-24 surface-container-lowest border-none rounded px-4 py-3 text-center text-xl text-on-surface font-body text-mono focus:ring-1 focus:ring-primary/40">
          <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wide text-on-surface-variant">sec</span>
        </div>
      </div>
    </div>
    
      <div class="absolute bottom-8 left-8 right-8 flex justify-between items-center">
        <div class="flex gap-4">
          <button 
            @click="mode = 'focus'"
            :class="mode === 'focus' ? 'text-focus' : 'text-on-surface-variant/40'"
            class="text-[10px] font-headline uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="mode === 'focus' ? 'bg-focus animate-pulse' : 'bg-on-surface-variant/40'"></span>
            Focus Mode
          </button>
          <button 
            @click="mode = 'rest'"
            :class="mode === 'rest' ? 'text-rest' : 'text-on-surface-variant/40'"
            class="text-[10px] font-headline uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="mode === 'rest' ? 'bg-rest animate-pulse' : 'bg-on-surface-variant/40'"></span>
            Rest Mode
          </button>
        </div>
        <div class="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <span v-if="longRestReady" class="px-2 py-0.5 rounded-sm bg-rest/10 border border-rest/20 text-rest text-[9px]">Long Rest Ready</span>
          Segment {{ focusSessionCount }}/4
        </div>
      </div>
  </div>
</template>

<style scoped>
.text-focus-gradient {
  font-family: 'Space Grotesk', monospace;
  letter-spacing: -0.05em;
  background: linear-gradient(to bottom, var(--color-focus) 0%, var(--color-tertiary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-rest-gradient {
  font-family: 'Space Grotesk', monospace;
  letter-spacing: -0.05em;
  background: linear-gradient(to bottom, var(--color-rest) 0%, var(--color-tertiary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<script setup lang="ts">
  import { ref, onUnmounted, computed, watch, onMounted } from 'vue'
  import PomodoroDB from '../utils/indexedDB'
  import type { Session, PresetConfig } from '../types'
  import { DEFAULT_CONFIG } from '../types'
  import chimeSound from '../assets/chime.m4a'

  const emit = defineEmits(['sessionSaved'])

  const minutes = ref(25)
  const seconds = ref(0)
  const minInput = ref(0)
  const secInput = ref(0)
  const showCustom = ref(false)
  const activePreset = ref(25)
  const taskTitle = ref('')
  const taskDescription = ref('')
  const taskCategory = ref('')
  const isRunning = ref(false)
  const mode = ref<'focus' | 'rest'>('focus')
  const sessionStartTime = ref(0)
  const focusSessionCount = ref(0)
  const longRestReady = ref(false)
  const streakCount = ref(parseInt(localStorage.getItem('streakCount') || '0', 10))
  const presets = ref<PresetConfig[]>(DEFAULT_CONFIG.presets)
  const defaultPreset = ref(DEFAULT_CONFIG.defaultPreset)
  let interv: any

  onMounted(async () => {
    await loadConfig()
  })

  const loadConfig = async () => {
    try {
      const config = await PomodoroDB.getConfig()
      presets.value = config.presets
      defaultPreset.value = config.defaultPreset
      if (!isRunning.value) {
        minutes.value = config.defaultPreset
        activePreset.value = config.defaultPreset
      }
    } catch {}
  }

  const playChime = () => {
    const audio = new Audio(chimeSound)
    audio.play().catch(error => {
      console.error('Failed to play chime:', error)
    })
  }

  defineExpose({
    taskTitle,
    taskDescription,
    taskCategory,
    isRunning,
    streakCount,
    loadConfig
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
      stopTimer(true)
    }
  }

  const buttonHandler = () => {
    !interv ? startTimer() : pauseTimer()
  }

  const setPreset = (mins: number) => {
    longRestReady.value = false
    minutes.value = mins
    seconds.value = 0
    activePreset.value = mins
    showCustom.value = false
  }

  const toggleCustom = () => {
    showCustom.value = !showCustom.value
  }

  const startTimer = () => {
    if (interv) return
    if (showCustom.value) {
      if (minInput.value !== undefined && minInput.value !== null) minutes.value = minInput.value
      if (secInput.value !== undefined && secInput.value !== null) seconds.value = secInput.value
    }
    sessionStartTime.value = Date.now()
    isRunning.value = true
    interv = setInterval(() => {
      updateTime()
    }, 1000);
  }

  const pauseTimer = () => {
    if (!interv) return
    clearInterval(interv)
    interv = null
  }

  const resetTimerLogic = () => {
    if (interv) {
      clearInterval(interv)
      interv = null
    }
    if (!longRestReady.value) {
      minutes.value = defaultPreset.value
      seconds.value = 0
      activePreset.value = defaultPreset.value
    }
    isRunning.value = false
  }

  const resetTimer = () => {
    longRestReady.value = false
    resetTimerLogic()
  }

  const stopTimer = async (naturalFinish = false) => {
    if (!interv) return
    clearInterval(interv)
    
    if (naturalFinish) {
      playChime()
    }
    
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
    
    if (mode.value === 'focus') {
      focusSessionCount.value++
      streakCount.value++
      localStorage.setItem('streakCount', streakCount.value.toString())
      if (focusSessionCount.value >= 4) {
        longRestReady.value = true
        mode.value = 'rest'
        minutes.value = 10
        seconds.value = 0
        activePreset.value = 10
        showCustom.value = false
      }
    }
    
    resetTimerLogic()
    emit('sessionSaved')
  }

  watch(mode, (newMode) => {
    if (newMode === 'focus') {
      longRestReady.value = false
    }
  })

  onUnmounted(() => {
    stopTimer(false)
  })
</script>
