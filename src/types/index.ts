export type { Database, OrderStatus, OrderItem, ShippingAddress } from './database'

export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  category_id: string
  price: number
  unit: string
  inventory: number
  is_active: boolean
  images: string[]
  metadata: Record<string, any> | null
  created_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface CartItem {
  product_id: string
  title: string
  price: number
  unit: string
  quantity: number
  image_url?: string
}

export interface User {
  id: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  email?: string
}

export interface PaymentRequest {
  order_id: string
  amount: number
  user_phone: string
  user_email?: string
}

export interface PaymentResponse {
  payment_url?: string
  payment_id: string
  status: 'success' | 'error'
  message: string
}