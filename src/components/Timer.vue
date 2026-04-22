<template>
  <div class="flex-1">
    <div class="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
      <div class="text-center">
        <div class="mb-4">
          <span class="text-white/60 text-sm font-medium tracking-widest uppercase">Pomodoro Timer</span>
        </div>
        <div class="flex justify-center gap-3 mb-8">
          <button 
            @click="mode = 'focus'" 
            :class="mode === 'focus' ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/60 hover:text-white'"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20"
          >
            FOCUS
          </button>
          <button 
            @click="mode = 'rest'" 
            :class="mode === 'rest' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60 hover:text-white'"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-white/20"
          >
            REST
          </button>
        </div>
        <div class="text-8xl font-light text-white mb-8 font-mono tracking-wider">{{timeString}}</div>
        
        <transition name="content-fade" mode="out-in">
          <div v-if="!isRunning" key="setup" class="text-center">
            <button 
              @click="buttonHandler" 
              :class="mode === 'focus' ? 'from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 hover:shadow-violet-500/25' : 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/25'"
              class="px-8 py-3 bg-gradient-to-r text-white font-medium rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 mb-6"
            >
              {{buttonText}}
            </button>
            <div class="flex justify-center gap-3 mb-8">
              <button @click="setPreset(5)" class="px-5 py-2 bg-white/10 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-200">
                5m
              </button>
              <button @click="setPreset(10)" class="px-5 py-2 bg-white/10 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-200">
                10m
              </button>
              <button @click="setPreset(25)" class="px-5 py-2 bg-white/10 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-200">
                25m
              </button>
              <button @click="toggleCustom" :class="showCustom ? 'bg-white/30 text-white border-white/40' : 'bg-white/10 border-white/20 text-white/80'" class="px-5 py-2 border text-white/80 text-sm font-medium rounded-full hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-200">
                Custom
              </button>
            </div>
            <div v-show="showCustom" class="mt-8 flex items-center justify-center gap-4">
              <div class="relative">
                <input type="number" min="0" max="60" v-model="minInput" placeholder="00" class="w-24 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-white/30 hover:bg-white/15">
                <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium uppercase tracking-wide">min</span>
              </div>
              <span class="text-white/40 text-2xl font-light">:</span>
              <div class="relative">
                <input type="number" min="0" max="60" v-model="secInput" placeholder="00" class="w-24 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-white/30 hover:bg-white/15">
                <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium uppercase tracking-wide">sec</span>
              </div>
            </div>
          </div>
          <div v-else key="running" class="text-center">
            <div v-if="taskTitle" class="mb-6">
              <h2 class="text-2xl font-semibold text-white mb-3">{{taskTitle}}</h2>
              <div v-if="taskCategory" class="inline-block px-3 py-1 mb-3 rounded-full text-sm font-medium" :class="mode === 'focus' ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30' : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'">
                {{taskCategory}}
              </div>
              <p v-if="taskDescription" class="text-white/70 text-lg leading-relaxed">{{taskDescription}}</p>
            </div>
            <button 
              @click="buttonHandler" 
              :class="mode === 'focus' ? 'from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 hover:shadow-violet-500/25' : 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/25'"
              class="px-8 py-3 bg-gradient-to-r text-white font-medium rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95"
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

    const session: Session = {
      title: taskTitle.value,
      category: taskCategory.value,
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
