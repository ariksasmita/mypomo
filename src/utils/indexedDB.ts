import type { Session, CategoryStats, ExportData, Category, SessionMode } from '../types'

const DB_NAME = 'mypomo-db'
const DB_VERSION = 1

class PomodoroDB {
  private static db: IDBDatabase | null = null

  static async init(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
          sessionStore.createIndex('category', 'category', { unique: false })
          sessionStore.createIndex('mode', 'mode', { unique: false })
          sessionStore.createIndex('startTime', 'startTime', { unique: false })
        }

        if (!db.objectStoreNames.contains('categoryStats')) {
          db.createObjectStore('categoryStats', { keyPath: 'category' })
        }

        if (!db.objectStoreNames.contains('categories')) {
          const categoryStore = db.createObjectStore('categories', { keyPath: 'name' })
          categoryStore.createIndex('createdAt', 'createdAt', { unique: false })
        }
      }
    })
  }

  static async saveSession(session: Session): Promise<number> {
    const db = await this.init()
    const validCategory = await this.getOrCreateCategory(session.category)
    session.category = validCategory

    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readwrite')
      const store = tx.objectStore('sessions')
      const request = store.add(session)

      request.onsuccess = () => {
        const sessionId = request.result as number
        this.updateCategoryStats(validCategory, session.mode, session.duration)
        resolve(sessionId)
      }
      request.onerror = () => reject(request.error)
    })
  }

  static async getSessionsByCategory(category: string): Promise<Session[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readonly')
      const index = tx.objectStore('sessions').index('category')
      const request = index.getAll(category)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  static async getRecentSessions(limit: number, offset: number = 0): Promise<Session[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readonly')
      const index = tx.objectStore('sessions').index('startTime')
      const request = index.openCursor(null, 'prev')

      const sessions: Session[] = []
      let count = 0
      let skipped = 0

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null
        if (cursor) {
          if (skipped < offset) {
            skipped++
            cursor.continue()
          } else if (count < limit) {
            sessions.push(cursor.value)
            count++
            cursor.continue()
          } else {
            resolve(sessions)
          }
        } else {
          resolve(sessions)
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  static async getAllSessions(): Promise<Session[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readonly')
      const store = tx.objectStore('sessions')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  static async getSessionCount(): Promise<number> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readonly')
      const store = tx.objectStore('sessions')
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  static async getCategoryStats(category: string): Promise<CategoryStats | null> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categoryStats', 'readonly')
      const store = tx.objectStore('categoryStats')
      const request = store.get(category)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  static async getAllCategoryStats(): Promise<CategoryStats[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categoryStats', 'readonly')
      const store = tx.objectStore('categoryStats')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  static async updateCategoryStats(category: string, mode: SessionMode, duration: number): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categoryStats', 'readwrite')
      const store = tx.objectStore('categoryStats')
      const request = store.get(category)

      request.onsuccess = () => {
        const stats = request.result as CategoryStats | undefined

        if (stats) {
          stats.totalTime += duration
          if (mode === 'focus') {
            stats.focusSessions++
          } else {
            stats.restSessions++
          }
          stats.lastUpdated = Date.now()
          store.put(stats)
        } else {
          const newStats: CategoryStats = {
            category,
            totalTime: duration,
            focusSessions: mode === 'focus' ? 1 : 0,
            restSessions: mode === 'rest' ? 1 : 0,
            lastUpdated: Date.now()
          }
          store.add(newStats)
        }

        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      }

      request.onerror = () => reject(request.error)
    })
  }

  static async getOrCreateCategory(inputName: string): Promise<string> {
    const trimmed = inputName.trim()
    
    const exactMatch = await this.findExactCategory(trimmed.toLowerCase())
    if (exactMatch) return exactMatch

    const fuzzyMatch = await this.findSimilarCategory(trimmed)
    if (fuzzyMatch) return fuzzyMatch

    await this.createCategory(trimmed)
    return trimmed
  }

  private static async findExactCategory(name: string): Promise<string | null> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readonly')
      const store = tx.objectStore('categories')
      const request = store.openCursor()

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null
        if (cursor) {
          const category = cursor.value as Category
          if (category.name.toLowerCase() === name) {
            resolve(category.name)
          } else {
            cursor.continue()
          }
        } else {
          resolve(null)
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  private static async findSimilarCategory(name: string): Promise<string | null> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readonly')
      const store = tx.objectStore('categories')
      const request = store.openCursor()

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null
        if (cursor) {
          const category = cursor.value as Category
          const similarity = this.calculateSimilarity(name, category.name)
          
          if (similarity >= 0.8) {
            resolve(category.name)
          } else {
            cursor.continue()
          }
        } else {
          resolve(null)
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1
    if (str1.length === 0 || str2.length === 0) return 0

    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  private static async createCategory(name: string): Promise<void> {
    const db = await this.init()
    const category: Category = {
      name,
      createdAt: Date.now()
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readwrite')
      const store = tx.objectStore('categories')
      const request = store.add(category)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  static async getAllCategories(): Promise<string[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readonly')
      const store = tx.objectStore('categories')
      const request = store.getAll()

      request.onsuccess = () => {
        const categories = request.result as Category[]
        resolve(categories.map(c => c.name))
      }
      request.onerror = () => reject(request.error)
    })
  }

  static async exportToJSON(): Promise<Blob> {
    const sessions = await this.getAllSessions()
    const categoryStats = await this.getAllCategoryStats()

    const exportData: ExportData = {
      exportDate: new Date().toISOString(),
      categoryStats,
      sessions
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    return new Blob([jsonString], { type: 'application/json' })
  }
}

export default PomodoroDB
