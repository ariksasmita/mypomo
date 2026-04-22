<template>
  <transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-x-4 flex-0"
    enter-to-class="opacity-100 translate-x-0 flex-1"
    leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="opacity-100 translate-x-0 flex-1"
    leave-to-class="opacity-0 translate-x-4 flex-0"
  >
    <div v-if="!isRunning" class="glass-surface rounded-lg p-8 flex-1">
      <div class="mb-6">
        <span class="text-sm font-medium tracking-widest uppercase text-[var(--color-on-surface-variant)]">Session Details</span>
      </div>
      <div class="space-y-6">
        <div>
          <label class="block text-xs font-medium uppercase tracking-wide mb-2 text-[var(--color-on-surface-variant)]">Task Title</label>
          <input v-model="taskTitle" type="text" placeholder="What are you working on?" class="w-full surface-container-lowest rounded-[var(--radius-sm)] px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none transition-all duration-200 hover:surface-container-low">
        </div>
        <div>
          <label class="block text-xs font-medium uppercase tracking-wide mb-2 text-[var(--color-on-surface-variant)]">Category</label>
          <div class="relative">
            <input
              v-model="taskCategory"
              type="text"
              list="category-options"
              placeholder="Select or type category"
              class="w-full surface-container-lowest rounded-[var(--radius-sm)] px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none transition-all duration-200 hover:surface-container-low"
            >
            <datalist id="category-options">
              <option value="Project">Project</option>
              <option value="Chore">Chore</option>
              <option value="Others">Others</option>
            </datalist>
            <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-on-surface-variant)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium uppercase tracking-wide mb-2 text-[var(--color-on-surface-variant)]">Description</label>
          <textarea v-model="taskDescription" rows="4" placeholder="Add a short description..." class="w-full surface-container-lowest rounded-[var(--radius-sm)] px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none transition-all duration-200 hover:surface-container-low resize-none"></textarea>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const taskTitle = defineModel<string>('taskTitle')
const taskDescription = defineModel<string>('taskDescription')
const taskCategory = defineModel<string>('taskCategory')
const isRunning = defineModel<boolean>('isRunning')
</script>
