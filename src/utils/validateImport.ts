import type { ExportData, ImportValidation } from '../types'

const REQUIRED_SESSION_FIELDS: (keyof import('../types').Session)[] = [
  'title',
  'category',
  'mode',
  'duration',
  'startTime',
  'endTime',
]

const REQUIRED_TASK_FIELDS: (keyof import('../types').Task)[] = [
  'title',
  'category',
  'status',
  'order',
  'createdAt',
]

export function validateImport(raw: unknown): ImportValidation {
  if (raw === null || raw === undefined) {
    return { valid: false, error: 'File is empty' }
  }

  let parsed: unknown
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch {
      return { valid: false, error: 'Invalid JSON format' }
    }
  } else {
    parsed = raw
  }

  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, error: 'Invalid data structure — expected an object' }
  }

  const data = parsed as Record<string, unknown>

  if (typeof data.exportDate !== 'string') {
    return { valid: false, error: 'Missing or invalid "exportDate" field' }
  }

  if (!Array.isArray(data.sessions)) {
    return { valid: false, error: 'Missing or invalid "sessions" array' }
  }

  for (let i = 0; i < data.sessions.length; i++) {
    const session = data.sessions[i] as Record<string, unknown>
    for (const field of REQUIRED_SESSION_FIELDS) {
      if (session[field] === undefined || session[field] === null) {
        return { valid: false, error: `Session at index ${i} missing required field "${field}"` }
      }
    }
    if (session.mode !== 'focus' && session.mode !== 'rest') {
      return { valid: false, error: `Session at index ${i} has invalid mode "${String(session.mode)}" — expected "focus" or "rest"` }
    }
  }

  if (data.tasks !== undefined) {
    if (!Array.isArray(data.tasks)) {
      return { valid: false, error: 'Invalid "tasks" field — expected array' }
    }

    for (let i = 0; i < data.tasks.length; i++) {
      const task = data.tasks[i] as Record<string, unknown>
      for (const field of REQUIRED_TASK_FIELDS) {
        if (task[field] === undefined || task[field] === null) {
          return { valid: false, error: `Task at index ${i} missing required field "${field}"` }
        }
      }
      if (task.status !== 'todo' && task.status !== 'in_progress' && task.status !== 'done') {
        return { valid: false, error: `Task at index ${i} has invalid status "${String(task.status)}" — expected "todo", "in_progress", or "done"` }
      }
    }
  }

  return {
    valid: true,
    data: {
      exportDate: data.exportDate as string,
      categoryStats: (Array.isArray(data.categoryStats) ? data.categoryStats : []) as ExportData['categoryStats'],
      sessions: data.sessions as ExportData['sessions'],
      tasks: data.tasks as ExportData['tasks'],
    },
  }
}
