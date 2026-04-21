export type SessionMode = 'focus' | 'rest'

export interface Session {
  id?: number
  title: string
  category: string
  description: string
  mode: SessionMode
  duration: number
  startTime: number
  endTime: number
}

export interface CategoryStats {
  category: string
  totalTime: number
  focusSessions: number
  restSessions: number
  lastUpdated: number
}

export interface ExportData {
  exportDate: string
  categoryStats: CategoryStats[]
  sessions: Session[]
}

export interface Category {
  name: string
  createdAt: number
}
