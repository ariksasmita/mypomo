import { describe, it, expect } from 'vitest'

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const formatTotalTime = (totalFocus: number): string => {
  const h = Math.floor(totalFocus / 3600)
  const m = Math.floor((totalFocus % 3600) / 60)

  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}`
  return `0:${m.toString().padStart(2, '0')}`
}

describe('formatTime', () => {
  it('formats seconds only', () => {
    expect(formatTime(30)).toBe('30s')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(150)).toBe('2m 30s')
  })

  it('formats hours, minutes, and seconds', () => {
    expect(formatTime(3661)).toBe('1h 1m 1s')
  })

  it('formats zero', () => {
    expect(formatTime(0)).toBe('0s')
  })

  it('formats exactly 1 hour', () => {
    expect(formatTime(3600)).toBe('1h 0m 0s')
  })
})

describe('formatRelativeTime', () => {
  it('shows "just now" for less than 60 seconds', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 30000)).toBe('just now')
    expect(formatRelativeTime(now)).toBe('just now')
    expect(formatRelativeTime(now - 1000)).toBe('just now')
  })

  it('shows minutes ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 5 * 60 * 1000)).toBe('5m ago')
    expect(formatRelativeTime(now - 59 * 60 * 1000)).toBe('59m ago')
  })

  it('shows hours ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 2 * 3600 * 1000)).toBe('2h ago')
    expect(formatRelativeTime(now - 23 * 3600 * 1000)).toBe('23h ago')
  })

  it('shows days ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 3 * 86400 * 1000)).toBe('3d ago')
    expect(formatRelativeTime(now - 30 * 86400 * 1000)).toBe('30d ago')
  })
})

describe('formatTotalTime', () => {
  it('formats zero time', () => {
    expect(formatTotalTime(0)).toBe('0:00')
  })

  it('formats minutes only', () => {
    expect(formatTotalTime(1500)).toBe('0:25')
  })

  it('formats hours and minutes', () => {
    expect(formatTotalTime(5400)).toBe('1:30')
  })

  it('pads minutes to 2 digits', () => {
    expect(formatTotalTime(3660)).toBe('1:01')
  })
})
