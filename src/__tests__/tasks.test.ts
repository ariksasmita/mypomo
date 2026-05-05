import { describe, it, expect, beforeEach } from 'vitest'
import PomodoroDB from '../utils/indexedDB'

describe('PomodoroDB Tasks', () => {
  beforeEach(async () => {
    await PomodoroDB.resetDatabase()
  })

  describe('saveTask', () => {
    it('saves a task and returns an id', async () => {
      const id = await PomodoroDB.saveTask({
        title: 'Design audit',
        category: 'Work',
        status: 'todo',
        order: 0,
        estimatedSessions: 4,
        completedSessions: 0,
        createdAt: Date.now(),
      })
      expect(id).toBeGreaterThan(0)
    })

    it('saves multiple tasks with incrementing ids', async () => {
      const id1 = await PomodoroDB.saveTask({
        title: 'Task 1',
        category: 'Main',
        status: 'todo',
        order: 0,
        estimatedSessions: 1,
        completedSessions: 0,
        createdAt: Date.now(),
      })
      const id2 = await PomodoroDB.saveTask({
        title: 'Task 2',
        category: 'Main',
        status: 'todo',
        order: 1,
        estimatedSessions: 1,
        completedSessions: 0,
        createdAt: Date.now(),
      })
      expect(id2).toBeGreaterThan(id1)
    })
  })

  describe('getTask', () => {
    it('retrieves a task by id', async () => {
      const id = await PomodoroDB.saveTask({
        title: 'Test task',
        category: 'Work',
        status: 'todo',
        order: 0,
        estimatedSessions: 2,
        completedSessions: 0,
        createdAt: Date.now(),
      })

      const task = await PomodoroDB.getTask(id)
      expect(task).not.toBeNull()
      expect(task!.title).toBe('Test task')
      expect(task!.category).toBe('Work')
      expect(task!.status).toBe('todo')
    })

    it('returns null for non-existent task', async () => {
      const task = await PomodoroDB.getTask(9999)
      expect(task).toBeNull()
    })
  })

  describe('updateTask', () => {
    it('updates task fields', async () => {
      const id = await PomodoroDB.saveTask({
        title: 'Original',
        category: 'Main',
        status: 'todo',
        order: 0,
        estimatedSessions: 3,
        completedSessions: 0,
        createdAt: Date.now(),
      })

      const task = await PomodoroDB.getTask(id)
      task!.title = 'Updated'
      task!.status = 'in_progress'
      await PomodoroDB.updateTask(task!)

      const updated = await PomodoroDB.getTask(id)
      expect(updated!.title).toBe('Updated')
      expect(updated!.status).toBe('in_progress')
    })
  })

  describe('deleteTask', () => {
    it('deletes a task', async () => {
      const id = await PomodoroDB.saveTask({
        title: 'To delete',
        category: 'Main',
        status: 'todo',
        order: 0,
        estimatedSessions: 1,
        completedSessions: 0,
        createdAt: Date.now(),
      })

      await PomodoroDB.deleteTask(id)
      const task = await PomodoroDB.getTask(id)
      expect(task).toBeNull()
    })
  })

  describe('getTodayTasks', () => {
    it('returns tasks created today sorted by order', async () => {
      await PomodoroDB.saveTask({
        title: 'Second',
        category: 'Main',
        status: 'todo',
        order: 2,
        estimatedSessions: 1,
        completedSessions: 0,
        createdAt: Date.now(),
      })
      await PomodoroDB.saveTask({
        title: 'First',
        category: 'Main',
        status: 'todo',
        order: 1,
        estimatedSessions: 1,
        completedSessions: 0,
        createdAt: Date.now(),
      })

      const tasks = await PomodoroDB.getTodayTasks()
      expect(tasks).toHaveLength(2)
      expect(tasks[0].title).toBe('First')
      expect(tasks[1].title).toBe('Second')
    })

    it('includes completed tasks from today', async () => {
      const id = await PomodoroDB.saveTask({
        title: 'Done today',
        category: 'Main',
        status: 'done',
        order: 0,
        estimatedSessions: 1,
        completedSessions: 1,
        createdAt: Date.now(),
        completedAt: Date.now(),
      })

      const tasks = await PomodoroDB.getTodayTasks()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].id).toBe(id)
    })

    it('excludes completed tasks from previous days', async () => {
      const yesterday = Date.now() - 86400000
      await PomodoroDB.saveTask({
        title: 'Old done',
        category: 'Main',
        status: 'done',
        order: 0,
        estimatedSessions: 1,
        completedSessions: 1,
        createdAt: yesterday,
        completedAt: yesterday,
      })

      const tasks = await PomodoroDB.getTodayTasks()
      expect(tasks).toHaveLength(0)
    })
  })

  describe('getActiveTasks', () => {
    it('returns only non-done tasks', async () => {
      await PomodoroDB.saveTask({
        title: 'Active',
        category: 'Main',
        status: 'todo',
        order: 0,
        estimatedSessions: 1,
        completedSessions: 0,
        createdAt: Date.now(),
      })
      await PomodoroDB.saveTask({
        title: 'Done',
        category: 'Main',
        status: 'done',
        order: 1,
        estimatedSessions: 1,
        completedSessions: 1,
        createdAt: Date.now(),
        completedAt: Date.now(),
      })

      const tasks = await PomodoroDB.getActiveTasks()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe('Active')
    })
  })

  describe('incrementTaskSessions', () => {
    it('increments completed sessions', async () => {
      const id = await PomodoroDB.saveTask({
        title: 'Task',
        category: 'Main',
        status: 'todo',
        order: 0,
        estimatedSessions: 3,
        completedSessions: 0,
        createdAt: Date.now(),
      })

      await PomodoroDB.incrementTaskSessions(id)
      const task = await PomodoroDB.getTask(id)
      expect(task!.completedSessions).toBe(1)
      expect(task!.status).toBe('todo')
    })

    it('marks task done when reaching estimated sessions', async () => {
      const id = await PomodoroDB.saveTask({
        title: 'Task',
        category: 'Main',
        status: 'in_progress',
        order: 0,
        estimatedSessions: 2,
        completedSessions: 1,
        createdAt: Date.now(),
      })

      await PomodoroDB.incrementTaskSessions(id)
      const task = await PomodoroDB.getTask(id)
      expect(task!.completedSessions).toBe(2)
      expect(task!.status).toBe('done')
      expect(task!.completedAt).toBeDefined()
    })

    it('does nothing for non-existent task', async () => {
      await expect(PomodoroDB.incrementTaskSessions(9999)).resolves.toBeUndefined()
    })
  })

  describe('getNextTaskOrder', () => {
    it('returns 0 when no tasks exist', async () => {
      const order = await PomodoroDB.getNextTaskOrder()
      expect(order).toBe(0)
    })

    it('returns max order + 1', async () => {
      await PomodoroDB.saveTask({
        title: 'Task',
        category: 'Main',
        status: 'todo',
        order: 5,
        estimatedSessions: 1,
        completedSessions: 0,
        createdAt: Date.now(),
      })

      const order = await PomodoroDB.getNextTaskOrder()
      expect(order).toBe(6)
    })
  })

  describe('session + task integration', () => {
    it('session can reference a task via taskId', async () => {
      const taskId = await PomodoroDB.saveTask({
        title: 'Linked task',
        category: 'Work',
        status: 'todo',
        order: 0,
        estimatedSessions: 2,
        completedSessions: 0,
        createdAt: Date.now(),
      })

      const sessionId = await PomodoroDB.saveSession({
        title: 'Linked session',
        category: 'Work',
        description: '',
        mode: 'focus',
        duration: 1500,
        startTime: Date.now() - 1500000,
        endTime: Date.now(),
        taskId,
      })

      expect(sessionId).toBeGreaterThan(0)

      const sessions = await PomodoroDB.getAllSessions()
      expect(sessions[0].taskId).toBe(taskId)
    })
  })
})
