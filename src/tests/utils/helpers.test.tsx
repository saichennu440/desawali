import { describe, it, expect } from 'vitest'
import { formatCurrency, isValidEmail, isValidPhone, generateSlug } from '../../utils/helpers'

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(100)).toBe('₹100.00')
      expect(formatCurrency(1000)).toBe('₹1,000.00')
      expect(formatCurrency(1234.56)).toBe('₹1,234.56')
    })
  })

  describe('isValidEmail', () => {
    it('validates email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user@domain.co.in')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('validates Indian phone numbers correctly', () => {
      expect(isValidPhone('9876543210')).toBe(true)
      expect(isValidPhone('8123456789')).toBe(true)
      expect(isValidPhone('1234567890')).toBe(false) // doesn't start with 6-9
      expect(isValidPhone('987654321')).toBe(false) // too short
      expect(isValidPhone('98765432100')).toBe(false) // too long
    })
  })

  describe('generateSlug', () => {
    it('generates slugs correctly', () => {
      expect(generateSlug('Mango Pickle')).toBe('mango-pickle')
      expect(generateSlug('Fresh Tiger Prawns!')).toBe('fresh-tiger-prawns')
      expect(generateSlug('  Spicy Lemon  ')).toBe('spicy-lemon')
      expect(generateSlug('Fish & Seafood')).toBe('fish-seafood')
    })
  })
})