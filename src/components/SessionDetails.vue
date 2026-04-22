<template>
  <transition 
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-x-4 flex-0"
    enter-to-class="opacity-100 translate-x-0 flex-1"
    leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="opacity-100 translate-x-0 flex-1"
    leave-to-class="opacity-0 translate-x-4 flex-0"
  >
    <div v-if="!isRunning" class="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 flex-1">
      <div class="mb-6">
        <span class="text-white/60 text-sm font-medium tracking-widest uppercase">Session Details</span>
      </div>
      <div class="space-y-6">
        <div>
          <label class="block text-white/70 text-xs font-medium uppercase tracking-wide mb-2">Task Title</label>
          <input v-model="taskTitle" type="text" placeholder="What are you working on?" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:bg-white/15">
        </div>
        <div>
          <label class="block text-white/70 text-xs font-medium uppercase tracking-wide mb-2">Category</label>
          <div class="relative">
            <input 
              v-model="taskCategory" 
              type="text" 
              list="category-options"
              placeholder="Select or type category"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:bg-white/15"
            >
            <datalist id="category-options">
              <option value="Project">Project</option>
              <option value="Chore">Chore</option>
              <option value="Others">Others</option>
            </datalist>
            <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <div>
          <label class="block text-white/70 text-xs font-medium uppercase tracking-wide mb-2">Description</label>
          <textarea v-model="taskDescription" rows="4" placeholder="Add a short description..." class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:bg-white/15 resize-none"></textarea>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, defineModel } from 'vue'

const taskTitle = defineModel<string>('taskTitle')
const taskDescription = defineModel<string>('taskDescription')
const taskCategory = defineModel<string>('taskCategory')
const isRunning = defineModel<boolean>('isRunning')
</script>
