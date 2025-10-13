import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test('user can add items to cart and proceed to checkout', async ({ page }) => {
    // Go to shop page
    await page.goto('/shop')

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })

    // Add first product to cart
    await page.click('[data-testid="product-card"]:first-child [data-testid="add-to-cart"]')

    // Check that cart badge shows 1 item
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')

    // Open cart
    await page.click('[data-testid="cart-button"]')

    // Verify cart sidebar opens with product
    await expect(page.locator('[data-testid="cart-sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)

    // Click checkout button
    await page.click('[data-testid="checkout-button"]')

    // Should redirect to auth if not logged in
    await expect(page).toHaveURL('/auth')

    // Fill sign up form
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="full-name-input"]', 'Test User')
    await page.click('button[type="submit"]')

    // Note: This would need actual auth integration to complete
    // For now, we're testing the flow up to the auth step
  })

  test('cart persists across page reloads', async ({ page }) => {
    // Go to shop page
    await page.goto('/shop')

    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]')
    await page.click('[data-testid="product-card"]:first-child [data-testid="add-to-cart"]')

    // Reload page
    await page.reload()

    // Check that cart still shows 1 item
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')
  })

  test('user can update cart quantities', async ({ page }) => {
    // Go to shop page
    await page.goto('/shop')

    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]')
    await page.click('[data-testid="product-card"]:first-child [data-testid="add-to-cart"]')

    // Open cart
    await page.click('[data-testid="cart-button"]')

    // Increase quantity
    await page.click('[data-testid="increase-quantity"]')

    // Check quantity updated to 2
    await expect(page.locator('[data-testid="item-quantity"]')).toHaveText('2')
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('2')

    // Decrease quantity
    await page.click('[data-testid="decrease-quantity"]')

    // Check quantity back to 1
    await expect(page.locator('[data-testid="item-quantity"]')).toHaveText('1')
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')
  })
})