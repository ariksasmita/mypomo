<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-8">
    <div class="flex gap-6 w-full max-w-4xl items-stretch">
      <div class="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-500 ease-in-out" :class="isRunning ? 'flex-1' : 'flex-1'">
        <div class="text-center">
          <div class="mb-8">
            <span class="text-white/60 text-sm font-medium tracking-widest uppercase">Pomodoro Timer</span>
          </div>
          <div class="text-8xl font-light text-white mb-8 font-mono tracking-wider">{{timeString}}</div>
          
          <transition name="content-fade" mode="out-in">
            <div v-if="!isRunning" key="setup" class="text-center">
              <button @click="buttonHandler" class="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-full hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 active:scale-95 mb-6">
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
                <p v-if="taskDescription" class="text-white/70 text-lg leading-relaxed">{{taskDescription}}</p>
              </div>
              <button @click="buttonHandler" class="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-full hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 active:scale-95">
                {{buttonText}}
              </button>
            </div>
          </transition>
        </div>
      </div>
      <transition 
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-x-4 flex-0"
        enter-to-class="opacity-100 translate-x-0 flex-1"
        leave-active-class="transition-all duration-500 ease-in"
        leave-from-class="opacity-100 translate-x-0 flex-1"
        leave-to-class="opacity-0 translate-x-4 flex-0"
      >
        <div v-if="!isRunning" key="details" class="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 flex-1">
          <div class="mb-6">
            <span class="text-white/60 text-sm font-medium tracking-widest uppercase">Session Details</span>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-white/70 text-xs font-medium uppercase tracking-wide mb-2">Task Title</label>
              <input v-model="taskTitle" type="text" placeholder="What are you working on?" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:bg-white/15">
            </div>
            <div>
              <label class="block text-white/70 text-xs font-medium uppercase tracking-wide mb-2">Description</label>
              <textarea v-model="taskDescription" rows="4" placeholder="Add a short description..." class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:bg-white/15 resize-none"></textarea>
            </div>
          </div>
        </div>
      </transition>
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

  const minutes = ref(0)
  const seconds = ref(0)
  const minInput = ref(0)
  const secInput = ref(0)
  const showCustom = ref(false)
  const taskTitle = ref('')
  const taskDescription = ref('')
  const isRunning = ref(false)
  const buttonText = ref('Start')
  let interv: any

  const timeString = computed(() => {
    const min = minutes.value < 10 ? `0${minutes.value.toString()}` : minutes.value.toString()
    const sec = seconds.value < 10 ? `0${seconds.value.toString()}` : seconds.value.toString()
    return `${min}:${sec}`
  })

  const updateTime = () => {
    // minutes
    if (minutes.value > 0 && seconds.value === 0) {
      minutes.value = minutes.value - 1
      seconds.value = 59
      return
    }

    // seconds
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
    buttonText.value = 'Stop'
    isRunning.value = true
    interv = setInterval(() => {
      updateTime()
    }, 1000);
  }

  const stopTimer = () => {
    if (!interv) return
    clearInterval(interv)
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
