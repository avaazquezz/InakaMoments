import { describe, expect, it } from 'vitest'
import { bizumConcept } from './bizum'

describe('bizumConcept', () => {
  it('genera "Fiesta {cliente} {fecha}"', () => {
    expect(bizumConcept({ clientName: 'Adrián Vázquez', eventDate: '2026-08-30' }))
      .toBe('Fiesta Adrián Vázquez 2026-08-30')
  })
})
