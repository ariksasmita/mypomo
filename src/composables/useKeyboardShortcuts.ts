import { onMounted, onUnmounted, ref } from 'vue'

export interface ShortcutActions {
  toggleTimer: () => void
  resetTimer: () => void
  focusMode: () => void
  restMode: () => void
  nextTask: () => void
  prevTask: () => void
  startSelectedTask: () => void
  addTask: () => void
  toggleTaskDone: () => void
  editSelectedTask: () => void
  openSettings: () => void
  toggleHelp: () => void
}

export interface ShortcutDef {
  key: string
  label: string
  category: string
}

export const SHORTCUTS: ShortcutDef[] = [
  { key: 'Space', label: 'Start / Pause timer', category: 'Timer' },
  { key: 'R', label: 'Reset timer', category: 'Timer' },
  { key: 'F', label: 'Focus mode', category: 'Timer' },
  { key: 'D', label: 'Rest mode', category: 'Timer' },
  { key: 'J', label: 'Next task', category: 'Tasks' },
  { key: 'K', label: 'Previous task', category: 'Tasks' },
  { key: 'Enter', label: 'Start selected task', category: 'Tasks' },
  { key: 'A', label: 'Add new task', category: 'Tasks' },
  { key: 'X', label: 'Toggle task done', category: 'Tasks' },
  { key: 'E', label: 'Edit selected task', category: 'Tasks' },
  { key: 'S', label: 'Open settings', category: 'App' },
  { key: '?', label: 'Show shortcuts', category: 'App' },
  { key: 'Esc', label: 'Close modal / deselect', category: 'App' },
]

export function useKeyboardShortcuts(actions: ShortcutActions) {
  const showHelp = ref(false)

  const isInputFocused = (): boolean => {
    const el = document.activeElement
    if (!el) return false
    const tag = el.tagName.toLowerCase()
    return tag === 'input' || tag === 'textarea' || tag === 'select' || (el as HTMLElement).isContentEditable
  }

  const handler = (e: KeyboardEvent) => {
    if (isInputFocused()) {
      if (e.key === 'Escape') {
        ;(document.activeElement as HTMLElement)?.blur()
      }
      return
    }

    const key = e.key

    switch (key) {
      case ' ':
        e.preventDefault()
        actions.toggleTimer()
        break
      case 'r':
        actions.resetTimer()
        break
      case 'f':
        actions.focusMode()
        break
      case 'd':
        actions.restMode()
        break
      case 'j':
        actions.nextTask()
        break
      case 'k':
        actions.prevTask()
        break
      case 'Enter':
        actions.startSelectedTask()
        break
      case 'a':
        actions.addTask()
        break
      case 'x':
        actions.toggleTaskDone()
        break
      case 'e':
        actions.editSelectedTask()
        break
      case 's':
        actions.openSettings()
        break
      case '?':
        actions.toggleHelp()
        break
      case 'Escape':
        showHelp.value = false
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handler)
  })

  return { showHelp }
}
