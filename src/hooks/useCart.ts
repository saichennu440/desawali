import { useState, useEffect } from 'react'
import type { CartItem } from '../types'
import { calculateCartTotal } from '../utils/helpers'

const CART_STORAGE_KEY = 'desawali_cart'

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [items])

  const addItem = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    console.log('Adding item to cart:', product, quantity)
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product_id === product.product_id)
      
      if (existingItem) {
        console.log('Item exists, updating quantity')
        return currentItems.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        console.log('New item, adding to cart')
        return [...currentItems, { ...product, quantity }]
      }
    })
    
    // Show cart sidebar when item is added
    setTimeout(() => {
      setIsOpen(true)
    }, 100)
  }

  const removeItem = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product_id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotal = () => {
    return calculateCartTotal(items)
  }

  const hasItem = (productId: string) => {
    return items.some(item => item.product_id === productId)
  }

  const getItem = (productId: string) => {
    return items.find(item => item.product_id === productId)
  }

  return {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotal,
    hasItem,
    getItem,
  }
}