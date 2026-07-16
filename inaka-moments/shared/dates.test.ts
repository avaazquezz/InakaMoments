import { describe, expect, it } from 'vitest'
import { addDaysISO, formatISODate, todayISO } from './dates'

describe('formatISODate', () => {
  it('serializa usando componentes locales, no toISOString/UTC', () => {
    expect(formatISODate(new Date(2026, 0, 1))).toBe('2026-01-01')
  })
  it('rellena con cero mes y día de un dígito', () => {
    expect(formatISODate(new Date(2026, 2, 5))).toBe('2026-03-05')
  })
  it('cruza el límite de año correctamente', () => {
    expect(formatISODate(new Date(2025, 11, 31))).toBe('2025-12-31')
  })
})

describe('todayISO', () => {
  it('coincide con formatISODate(new Date())', () => {
    expect(todayISO()).toBe(formatISODate(new Date()))
  })
})

describe('addDaysISO', () => {
  it('con 0 días devuelve hoy', () => {
    expect(addDaysISO(0)).toBe(todayISO())
  })
  it('suma días respetando el cruce de mes', () => {
    const hoy = new Date()
    const esperado = new Date(hoy)
    esperado.setDate(esperado.getDate() + 45)
    expect(addDaysISO(45)).toBe(formatISODate(esperado))
  })
})
