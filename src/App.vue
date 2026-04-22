<script setup lang="ts">
import { ref } from 'vue'
import Timer from './components/Timer.vue'
import SessionDetails from './components/SessionDetails.vue'
import Stats from './components/Stats.vue'

const timerRef = ref()
const statsRef = ref()
</script>

  <template>
  <div class="min-h-screen flex items-center justify-center p-8 tech-trace">
    <div class="flex flex-col gap-6 w-full max-w-6xl items-stretch pl-8">
      <div class="flex gap-6 w-full">
        <Timer ref="timerRef" @session-saved="statsRef?.refreshStats()" class="flex-2" />
        <SessionDetails 
          v-if="timerRef"
          v-model:taskTitle="timerRef.taskTitle"
          v-model:taskDescription="timerRef.taskDescription"
          v-model:taskCategory="timerRef.taskCategory"
          v-model:isRunning="timerRef.isRunning"
        />
      </div>
      <Stats ref="statsRef" />
    </div>
  </div>
</template>
