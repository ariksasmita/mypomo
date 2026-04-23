import { describe, it, expect, beforeEach } from 'vitest'
import PomodoroDB from '../utils/indexedDB'
import { DEFAULT_CONFIG } from '../types'

describe('PomodoroDB', () => {
  beforeEach(async () => {
    await PomodoroDB.resetDatabase()
  })

  describe('config', () => {
    it('returns default config when no config exists', async () => {
      const config = await PomodoroDB.getConfig()
      expect(config).toEqual(DEFAULT_CONFIG)
    })

    it('saves and retrieves config', async () => {
      const customConfig = {
        presets: [{ minutes: 30, label: '30m' }],
        defaultPreset: 30,
        categories: ['Work', 'Personal'],
      }
      await PomodoroDB.saveConfig(customConfig)
      const config = await PomodoroDB.getConfig()
      expect(config).toEqual(customConfig)
    })

    it('overwrites existing config on save', async () => {
      await PomodoroDB.saveConfig({ ...DEFAULT_CONFIG, defaultPreset: 10 })
      await PomodoroDB.saveConfig({ ...DEFAULT_CONFIG, defaultPreset: 30 })
      const config = await PomodoroDB.getConfig()
      expect(config.defaultPreset).toBe(30)
    })
  })

  describe('sessions', () => {
    it('saves and retrieves a session', async () => {
      const session = {
        title: 'Test Session',
        category: 'Main',
        description: 'Test desc',
        mode: 'focus' as const,
        duration: 1500,
        startTime: Date.now() - 1500000,
        endTime: Date.now(),
      }
      const id = await PomodoroDB.saveSession(session)
      expect(id).toBeGreaterThan(0)

      const sessions = await PomodoroDB.getAllSessions()
      expect(sessions).toHaveLength(1)
      expect(sessions[0].title).toBe('Test Session')
      expect(sessions[0].category).toBe('Main')
    })

    it('gets sessions by category', async () => {
      await PomodoroDB.saveSession({
        title: 'Session 1',
        category: 'Work',
        description: '',
        mode: 'focus',
        duration: 1500,
        startTime: Date.now(),
        endTime: Date.now(),
      })
      await PomodoroDB.saveSession({
        title: 'Session 2',
        category: 'Personal',
        description: '',
        mode: 'focus',
        duration: 300,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const workSessions = await PomodoroDB.getSessionsByCategory('Work')
      expect(workSessions).toHaveLength(1)
      expect(workSessions[0].title).toBe('Session 1')
    })

    it('gets recent sessions with pagination', async () => {
      for (let i = 0; i < 5; i++) {
        await PomodoroDB.saveSession({
          title: `Session ${i}`,
          category: 'Main',
          description: '',
          mode: 'focus',
          duration: 1500,
          startTime: Date.now() + i * 1000,
          endTime: Date.now() + i * 1000 + 1000,
        })
      }

      const page1 = await PomodoroDB.getRecentSessions(2, 0)
      expect(page1).toHaveLength(2)

      const page2 = await PomodoroDB.getRecentSessions(2, 2)
      expect(page2).toHaveLength(2)

      const page3 = await PomodoroDB.getRecentSessions(2, 4)
      expect(page3).toHaveLength(1)
    })

    it('counts sessions', async () => {
      await PomodoroDB.saveSession({
        title: 'S1',
        category: 'Main',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })
      await PomodoroDB.saveSession({
        title: 'S2',
        category: 'Main',
        description: '',
        mode: 'focus',
        duration: 200,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const count = await PomodoroDB.getSessionCount()
      expect(count).toBe(2)
    })
  })

  describe('categories', () => {
    it('creates categories on session save', async () => {
      await PomodoroDB.saveSession({
        title: 'Test',
        category: 'NewCategory',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const categories = await PomodoroDB.getAllCategories()
      expect(categories).toContain('NewCategory')
    })

    it('fuzzy matches categories', async () => {
      await PomodoroDB.saveSession({
        title: 'Test',
        category: 'Production',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      await PomodoroDB.saveSession({
        title: 'Test 2',
        category: 'Productoin',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const categories = await PomodoroDB.getAllCategories()
      expect(categories).toHaveLength(1)
      expect(categories).toContain('Production')
    })

    it('case-insensitive category matching', async () => {
      await PomodoroDB.saveSession({
        title: 'Test',
        category: 'Work',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      await PomodoroDB.saveSession({
        title: 'Test 2',
        category: 'work',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const categories = await PomodoroDB.getAllCategories()
      expect(categories).toHaveLength(1)
    })
  })

  describe('categoryStats', () => {
    it('tracks stats per category', async () => {
      await PomodoroDB.saveSession({
        title: 'Test',
        category: 'Work',
        description: '',
        mode: 'focus',
        duration: 1500,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const stats = await PomodoroDB.getCategoryStats('Work')
      expect(stats).not.toBeNull()
      expect(stats!.focusSessions).toBe(1)
      expect(stats!.totalTime).toBe(1500)
    })

    it('gets all category stats', async () => {
      await PomodoroDB.saveSession({
        title: 'Test',
        category: 'Work',
        description: '',
        mode: 'focus',
        duration: 1500,
        startTime: Date.now(),
        endTime: Date.now(),
      })
      await PomodoroDB.saveSession({
        title: 'Test 2',
        category: 'Personal',
        description: '',
        mode: 'rest',
        duration: 300,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const allStats = await PomodoroDB.getAllCategoryStats()
      expect(allStats).toHaveLength(2)
    })
  })

  describe('exportToJSON', () => {
    it('exports sessions and stats as JSON blob', async () => {
      await PomodoroDB.saveSession({
        title: 'Test',
        category: 'Main',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      const blob = await PomodoroDB.exportToJSON()
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('application/json')

      const text = await blob.text()
      const data = JSON.parse(text)
      expect(data.exportDate).toBeDefined()
      expect(data.sessions).toHaveLength(1)
    })
  })

  describe('resetDatabase', () => {
    it('clears all data', async () => {
      await PomodoroDB.saveSession({
        title: 'Test',
        category: 'Main',
        description: '',
        mode: 'focus',
        duration: 100,
        startTime: Date.now(),
        endTime: Date.now(),
      })

      await PomodoroDB.resetDatabase()

      const count = await PomodoroDB.getSessionCount()
      expect(count).toBe(0)
    })
  })
})
