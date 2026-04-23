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

export interface PresetConfig {
  minutes: number
  label: string
}

export interface AppConfig {
  presets: PresetConfig[]
  defaultPreset: number
  categories: string[]
}

export const DEFAULT_CONFIG: AppConfig = {
  presets: [
    { minutes: 5, label: '5m' },
    { minutes: 10, label: '10m' },
    { minutes: 25, label: '25m' },
  ],
  defaultPreset: 25,
  categories: ['Main', 'Production', 'Creative Strategy', 'Admin / Ops', 'Deep Learning'],
}
