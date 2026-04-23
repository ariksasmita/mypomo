<template>
  <div class="flex flex-col gap-8">
    <div v-if="!isRunning" class="bg-surface-container-high rounded-lg p-8 border border-outline-variant/10 flex-1">
      <h2 class="font-headline text-xs uppercase tracking-widest text-secondary mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">edit_note</span>
        Session_Config
      </h2>
      <div class="space-y-6">
        <div>
          <label class="block font-headline text-[10px] uppercase tracking-tighter text-on-surface-variant mb-2">Task_Title</label>
          <input v-model="taskTitle" type="text" placeholder="Design System Audit..." class="w-full bg-surface-container-lowest border-none rounded p-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 font-body text-sm">
        </div>
        <div>
          <label class="block font-headline text-[10px] uppercase tracking-tighter text-on-surface-variant mb-2">Category</label>
          <div class="relative">
            <input
              v-model="taskCategory"
              type="text"
              list="category-options"
              placeholder="Select or type category"
              class="w-full bg-surface-container-lowest border-none rounded p-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 font-body text-sm"
            >
            <datalist id="category-options">
              <option value="Main">Main</option>
              <option value="Production">Production</option>
              <option value="Creative Strategy">Creative Strategy</option>
              <option value="Admin / Ops">Admin / Ops</option>
              <option value="Deep Learning">Deep Learning</option>
            </datalist>
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
          </div>
        </div>
        <div>
          <label class="block font-headline text-[10px] uppercase tracking-tighter text-on-surface-variant mb-2">Notes_Markdown</label>
          <textarea v-model="taskDescription" rows="6" placeholder="# Objectives..." class="w-full bg-surface-container-lowest border-none rounded p-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 font-body text-sm resize-none"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const taskTitle = defineModel<string>('taskTitle')
const taskDescription = defineModel<string>('taskDescription')
const taskCategory = defineModel<string>('taskCategory')
const isRunning = defineModel<boolean>('isRunning')
</script>
