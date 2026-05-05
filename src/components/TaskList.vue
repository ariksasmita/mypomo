<template>
  <div class="bg-surface-container-low rounded-lg border border-outline-variant/5 overflow-hidden">
    <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
      <h2 class="font-headline text-xs uppercase tracking-widest text-secondary flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">task_alt</span>
        Today's Tasks
      </h2>
      <button
        @click="showAddForm = true"
        class="px-3 py-1 rounded font-headline text-[10px] uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        + Add
      </button>
    </div>

    <div v-if="showAddForm" class="px-6 py-4 border-b border-outline-variant/10 bg-surface-container/50">
      <div class="space-y-3">
        <input
          v-model="newTitle"
          type="text"
          placeholder="What needs to be done?"
          class="w-full bg-surface-container-lowest border-none rounded px-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 font-body text-sm"
          @keyup.enter="addTask"
          @keyup.escape="cancelAdd"
        />
        <div class="flex flex-wrap gap-3 items-center">
          <input
            v-model="newCategory"
            type="text"
            list="task-category-options"
            placeholder="Category"
            class="flex-1 min-w-[140px] bg-surface-container-lowest border-none rounded px-4 py-2 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 font-body text-sm"
          />
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-headline uppercase tracking-wider text-on-surface-variant">Sessions</span>
            <input
              v-model.number="newEstimated"
              type="number"
              min="1"
              max="20"
              class="w-14 bg-surface-container-lowest border-none rounded px-2 py-2 text-center text-on-surface text-sm focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div class="flex gap-2">
            <button @click="addTask" class="px-3 py-2 rounded font-headline text-[10px] uppercase tracking-widest bg-primary text-on-primary hover:opacity-90 transition-opacity">Add</button>
            <button @click="cancelAdd" class="px-3 py-2 rounded font-headline text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Cancel</button>
          </div>
        </div>
        <datalist id="task-category-options">
          <option v-for="cat in categories" :key="cat" :value="cat" />
        </datalist>
      </div>
    </div>

    <div v-if="tasks.length === 0 && !showAddForm" class="px-6 py-8 text-center">
      <p class="text-on-surface-variant/40 font-body text-sm">No tasks yet. Add one to get started.</p>
    </div>

    <div class="divide-y divide-outline-variant/5">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center gap-3 px-6 py-3 group hover:bg-surface-container/30 transition-colors"
        :class="{ 'opacity-50': task.status === 'done', 'bg-primary/5 ring-1 ring-primary/20': tasks.indexOf(task) === selectedTaskIndex }"
      >
        <button
          @click="toggleDone(task)"
          class="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
          :class="task.status === 'done' ? 'border-rest bg-rest/20' : 'border-outline-variant/30 hover:border-primary'"
        >
          <span v-if="task.status === 'done'" class="material-symbols-outlined text-rest text-xs" style="font-variation-settings: 'FILL' 1;">check</span>
        </button>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-body text-sm text-on-surface truncate" :class="{ 'line-through text-on-surface-variant/50': task.status === 'done' }">{{ task.title }}</span>
          </div>
          <div class="flex items-center gap-3 mt-0.5">
            <span v-if="task.category" class="text-[10px] font-headline uppercase tracking-wider text-on-surface-variant/60">{{ task.category }}</span>
            <div class="flex items-center gap-1">
              <div
                v-for="i in task.estimatedSessions"
                :key="i"
                class="w-1.5 h-1.5 rounded-full"
                :class="i <= task.completedSessions ? 'bg-focus' : 'bg-outline-variant/20'"
              ></div>
              <span class="text-[10px] text-on-surface-variant/40">{{ task.completedSessions }}/{{ task.estimatedSessions }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button
            v-if="task.status !== 'done'"
            @click="handleStartTask(task)"
            class="p-1.5 rounded hover:bg-focus/10 text-on-surface-variant hover:text-focus transition-colors"
            title="Set as active"
          >
            <span class="material-symbols-outlined text-lg">play_arrow</span>
          </button>
          <button
            v-if="tasks.indexOf(task) > 0"
            @click="moveTask(task, -1)"
            class="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
            title="Move up"
          >
            <span class="material-symbols-outlined text-sm">arrow_upward</span>
          </button>
          <button
            v-if="tasks.indexOf(task) < tasks.length - 1"
            @click="moveTask(task, 1)"
            class="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
            title="Move down"
          >
            <span class="material-symbols-outlined text-sm">arrow_downward</span>
          </button>
          <button
            @click="removeTask(task.id!)"
            class="p-1.5 rounded hover:bg-red-500/10 text-on-surface-variant/40 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="doneCount > 0" class="px-6 py-3 border-t border-outline-variant/10 bg-surface-container/20">
      <span class="text-[10px] font-headline uppercase tracking-widest text-rest/60">{{ doneCount }} completed</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import PomodoroDB from '../utils/indexedDB'
import type { Task } from '../types'
import { DEFAULT_CONFIG } from '../types'

const emit = defineEmits<{
  startTask: [task: Task]
}>()

const tasks = ref<Task[]>([])
const categories = ref<string[]>(DEFAULT_CONFIG.categories)
const showAddForm = ref(false)
const newTitle = ref('')
const newCategory = ref('')
const newEstimated = ref(1)

const doneCount = computed(() => tasks.value.filter(t => t.status === 'done').length)

onMounted(async () => {
  await Promise.all([loadTasks(), loadConfig()])
})

const loadConfig = async () => {
  try {
    const config = await PomodoroDB.getConfig()
    categories.value = config.categories
  } catch {}
}

const loadTasks = async () => {
  try {
    tasks.value = await PomodoroDB.getTodayTasks()
  } catch {}
}

const selectedTaskIndex = ref(-1)

const selectNext = () => {
  if (tasks.value.length === 0) return
  selectedTaskIndex.value = selectedTaskIndex.value < tasks.value.length - 1
    ? selectedTaskIndex.value + 1
    : 0
}

const selectPrev = () => {
  if (tasks.value.length === 0) return
  selectedTaskIndex.value = selectedTaskIndex.value > 0
    ? selectedTaskIndex.value - 1
    : tasks.value.length - 1
}

const getSelectedTask = (): Task | null => {
  if (selectedTaskIndex.value < 0 || selectedTaskIndex.value >= tasks.value.length) return null
  return tasks.value[selectedTaskIndex.value]
}

const toggleSelectedDone = async () => {
  const task = getSelectedTask()
  if (!task) return
  await toggleDone(task)
}

const triggerAddTask = () => {
  showAddForm.value = true
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>('[placeholder="What needs to be done?"]')
    input?.focus()
  })
}

const handleStartTask = (task: Task) => {
  emit('startTask', task)
}

const addTask = async () => {
  const title = newTitle.value.trim()
  if (!title) return

  const order = tasks.value.length > 0
    ? Math.max(...tasks.value.map(t => t.order)) + 1
    : 0

  await PomodoroDB.saveTask({
    title,
    category: newCategory.value.trim() || 'Main',
    status: 'todo',
    order,
    estimatedSessions: newEstimated.value || 1,
    completedSessions: 0,
    createdAt: Date.now(),
  })

  newTitle.value = ''
  newCategory.value = ''
  newEstimated.value = 1
  showAddForm.value = false
  await loadTasks()
}

const cancelAdd = () => {
  showAddForm.value = false
  newTitle.value = ''
  newCategory.value = ''
  newEstimated.value = 1
}

const toggleDone = async (task: Task) => {
  if (task.status === 'done') {
    task.status = 'in_progress'
    task.completedAt = undefined
  } else {
    task.status = 'done'
    task.completedAt = Date.now()
  }
  await PomodoroDB.updateTask(task)
  await loadTasks()
}

const removeTask = async (id: number) => {
  await PomodoroDB.deleteTask(id)
  await loadTasks()
}

const moveTask = async (task: Task, direction: number) => {
  const idx = tasks.value.findIndex(t => t.id === task.id)
  const swapIdx = idx + direction
  if (swapIdx < 0 || swapIdx >= tasks.value.length) return

  const taskA = tasks.value[idx]
  const taskB = tasks.value[swapIdx]
  const tempOrder = taskA.order
  taskA.order = taskB.order
  taskB.order = tempOrder

  await Promise.all([
    PomodoroDB.updateTask(taskA),
    PomodoroDB.updateTask(taskB),
  ])
  await loadTasks()
}

defineExpose({ loadTasks, loadConfig, selectNext, selectPrev, getSelectedTask, toggleSelectedDone, triggerAddTask })
</script>
