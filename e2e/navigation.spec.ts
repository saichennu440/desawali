import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(page.locator('h1')).toContainText('Premium Pickles')
    
    // Check navigation links
    await expect(page.locator('nav a[href="/shop"]')).toBeVisible()
    await expect(page.locator('nav a[href="/about"]')).toBeVisible()
    await expect(page.locator('nav a[href="/contact"]')).toBeVisible()

    // Check featured products section loads
    await expect(page.locator('[data-testid="featured-products"]')).toBeVisible()
  })

  test('can navigate between pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to shop
    await page.click('nav a[href="/shop"]')
    await expect(page).toHaveURL('/shop')
    await expect(page.locator('h1')).toContainText('Shop All Products')

    // Navigate to about
    await page.click('nav a[href="/about"]')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h1')).toContainText('Our Story')

    // Navigate to contact
    await page.click('nav a[href="/contact"]')
    await expect(page).toHaveURL('/contact')
    await expect(page.locator('h1')).toContainText('Get in Touch')
  })

  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile menu should be hidden initially
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible()

    // Click mobile menu button
    await page.click('[data-testid="mobile-menu-button"]')

    // Mobile menu should be visible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()

    // Click a navigation link
    await page.click('[data-testid="mobile-menu"] a[href="/shop"]')

    // Should navigate and close menu
    await expect(page).toHaveURL('/shop')
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible()
  })

  test('404 page works', async ({ page }) => {
    await page.goto('/non-existent-page')

    await expect(page.locator('h1')).toContainText('Page Not Found')
    await expect(page.locator('a[href="/"]')).toBeVisible()
  })
})