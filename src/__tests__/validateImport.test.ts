import { describe, it, expect } from 'vitest'
import { validateImport } from '../utils/validateImport'
import type { ExportData } from '../types'

describe('validateImport', () => {
  const validSession = {
    title: 'Test',
    category: 'Main',
    description: 'Test session',
    mode: 'focus' as const,
    duration: 1500,
    startTime: Date.now(),
    endTime: Date.now() + 1500000,
  }

  const validTask = {
    title: 'Task 1',
    category: 'Main',
    status: 'todo' as const,
    order: 0,
    estimatedSessions: 1,
    completedSessions: 0,
    createdAt: Date.now(),
  }

  const validData: ExportData = {
    exportDate: new Date().toISOString(),
    categoryStats: [],
    sessions: [validSession],
    tasks: [validTask],
  }

  it('accepts valid JSON string', () => {
    const result = validateImport(JSON.stringify(validData))
    expect(result.valid).toBe(true)
    expect(result.data?.sessions).toHaveLength(1)
    expect(result.data?.tasks).toHaveLength(1)
  })

  it('accepts valid parsed object', () => {
    const result = validateImport(validData)
    expect(result.valid).toBe(true)
    expect(result.data?.sessions).toHaveLength(1)
  })

  it('accepts data without tasks', () => {
    const { tasks, ...withoutTasks } = validData
    const result = validateImport(withoutTasks)
    expect(result.valid).toBe(true)
    expect(result.data?.tasks).toBeUndefined()
  })

  it('accepts data without categoryStats', () => {
    const data = { exportDate: validData.exportDate, sessions: [validSession] }
    const result = validateImport(data)
    expect(result.valid).toBe(true)
  })

  it('rejects null', () => {
    const result = validateImport(null)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('File is empty')
  })

  it('rejects undefined', () => {
    const result = validateImport(undefined)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('File is empty')
  })

  it('rejects invalid JSON string', () => {
    const result = validateImport('{not valid json}')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Invalid JSON format')
  })

  it('rejects JSON array', () => {
    const result = validateImport('[]')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('expected an object')
  })

  it('rejects missing exportDate', () => {
    const { exportDate, ...noDate } = validData
    const result = validateImport(noDate)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('exportDate')
  })

  it('rejects missing sessions array', () => {
    const { sessions, ...noSessions } = validData
    const result = validateImport(noSessions)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('sessions')
  })

  it('rejects session missing required field', () => {
    const badSession = { ...validSession }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (badSession as any).title
    const result = validateImport({ ...validData, sessions: [badSession] })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Session at index 0')
    expect(result.error).toContain('title')
  })

  it('rejects invalid session mode', () => {
    const result = validateImport({
      ...validData,
      sessions: [{ ...validSession, mode: 'invalid' }],
    })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('invalid mode')
  })

  it('rejects tasks with invalid status', () => {
    const result = validateImport({
      ...validData,
      tasks: [{ ...validTask, status: 'unknown' }],
    })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('invalid status')
  })

  it('rejects task missing required field', () => {
    const badTask = { ...validTask }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (badTask as any).title
    const result = validateImport({ ...validData, tasks: [badTask] })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Task at index 0')
    expect(result.error).toContain('title')
  })

  it('rejects tasks field that is not an array', () => {
    const result = validateImport({ ...validData, tasks: 'not array' })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('tasks')
  })

  it('handles empty sessions array', () => {
    const result = validateImport({ ...validData, sessions: [] })
    expect(result.valid).toBe(true)
    expect(result.data?.sessions).toHaveLength(0)
  })

  it('handles empty tasks array', () => {
    const result = validateImport({ ...validData, tasks: [] })
    expect(result.valid).toBe(true)
    expect(result.data?.tasks).toHaveLength(0)
  })
})
