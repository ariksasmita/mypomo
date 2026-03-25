<template>
  <div>
    <div>{{timeString}}</div>
    <button @click="buttonHandler">{{buttonText}}</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted, computed } from 'vue'

  const minutes = ref(0)
  const seconds = ref(5)
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
    }

    // minutes
    if (minutes.value > 0) {
      minutes.value = minutes.value - 1
    }
  }

  const buttonHandler = () => {
    !interv ? startTimer() : stopTimer()
  }

  const startTimer = () => {
    if (interv) return
    buttonText.value = 'Stop'
    interv = setInterval(() => {
      updateTime()
    }, 1000);
  }

  const stopTimer = () => {
    if (!interv) return
    clearInterval(interv)
    minutes.value = 0
    seconds.value = 0
    buttonText.value = 'Start'
  }

  onUnmounted(() => {
    stopTimer()
  })
</script>
