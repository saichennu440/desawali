import React, { createContext, useContext } from 'react'
import { useCart } from '../hooks/useCart'

interface CartContextType {
  items: any[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (product: any, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
  hasItem: (productId: string) => boolean
  getItem: (productId: string) => any
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cart = useCart()

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider')
  }
  return context
}