<template>
  <div>
    <div>{{timeString}}</div>
    <button @click="buttonHandler">{{buttonText}}</button>
    <div>
      <input type="number" v-model="minInput" placeholder="min">
      <input type="number" v-model="secInput" placeholder="sec">
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted, computed } from 'vue'

  const minutes = ref(2)
  const seconds = ref(0)
  const minInput = ref(0)
  const secInput = ref(0)
  const buttonText = ref('Start')
  let interv: any

  const timeString = computed(() => {
    const min = minutes.value < 10 ? `0${minutes.value.toString()}` : minutes.value.toString()
    const sec = seconds.value < 10 ? `0${seconds.value.toString()}` : seconds.value.toString()
    return `${min}:${sec}`
  })

  const updateTime = () => {
    // seconds
    if (seconds.value > 0) {
      seconds.value = seconds.value - 1
    } else if (seconds.value === 0 && minutes.value > 0) {
      seconds.value = 59
    } else {
      resetTimer()
    }

    // minutes
    if (minutes.value > 0 && seconds.value === 0) {
      minutes.value = minutes.value - 1
    }
  }

  const buttonHandler = () => {
    !interv ? startTimer() : stopTimer()
  }

  const startTimer = () => {
    if (interv) return
    if (minInput.value) minutes.value = minInput.value
    if (secInput.value) seconds.value = secInput.value
    buttonText.value = 'Stop'
    interv = setInterval(() => {
      updateTime()
    }, 1000);
  }

  const stopTimer = () => {
    if (!interv) return
    clearInterval(interv)
    resetTimer()
  }

  const resetTimer = () => {
    minutes.value = 0
    seconds.value = 0
    buttonText.value = 'Start'
  }

  onUnmounted(() => {
    stopTimer()
  })
</script>
