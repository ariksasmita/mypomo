<template>
  <div>
    {{minString}}:{{secString}}
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'

  const minutes = ref(0)
  const seconds = ref(10)
  let interv: any

  const minString = computed(() => {
    return minutes.value < 10 ? `0${minutes.value.toString()}` : minutes.value.toString()
  })
  const secString = computed(() => {
    return seconds.value < 10 ? `0${seconds.value.toString()}` : seconds.value.toString()
  })

  const onFinish = () => {
    alert('times up')
    clearInterval(interv)
  }

  const updateTime = () => {
    // seconds
    if (seconds.value > 0) {
      seconds.value = seconds.value - 1
    } else if (seconds.value === 0 && minutes.value > 0) {
      seconds.value = 59
    } else {
      onFinish()
    }

    // minutes
    if (minutes.value > 0) {
      minutes.value = minutes.value - 1
    }
  }

  onMounted(() => {
    interv = setInterval(() => {
      updateTime()
    }, 1000);
  })

  onUnmounted(() => {
    interv && clearInterval(interv)
  })
</script>
