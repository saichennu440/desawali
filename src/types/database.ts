export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          is_admin?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
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
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          category_id: string
          price: number
          unit: string
          inventory?: number
          is_active?: boolean
          images?: string[]
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          category_id?: string
          price?: number
          unit?: string
          inventory?: number
          is_active?: boolean
          images?: string[]
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: OrderItem[]
          subtotal: number
          shipping: number
          tax: number
          total: number
          status: OrderStatus
          phonepe_payment_id: string | null
          phonepe_payment_status: string | null
          shipping_address: ShippingAddress
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items: OrderItem[]
          subtotal: number
          shipping?: number
          tax?: number
          total: number
          status?: OrderStatus
          phonepe_payment_id?: string | null
          phonepe_payment_status?: string | null
          shipping_address: ShippingAddress
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: OrderItem[]
          subtotal?: number
          shipping?: number
          tax?: number
          total?: number
          status?: OrderStatus
          phonepe_payment_id?: string | null
          phonepe_payment_status?: string | null
          shipping_address?: ShippingAddress
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          minimum_amount: number | null
          maximum_discount: number | null
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          minimum_amount?: number | null
          maximum_discount?: number | null
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          minimum_amount?: number | null
          maximum_discount?: number | null
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          created_at?: string
        }
      }
    }
  }
}

export type OrderStatus = 
  | 'Pending'
  | 'Paid'
  | 'Preparing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded'

export interface OrderItem {
  product_id: string
  title: string
  qty: number
  price: number
  unit: string
  image_url?: string
}

export interface ShippingAddress {
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
}