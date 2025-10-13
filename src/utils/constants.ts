export const CATEGORIES = {
  PICKLES: 'pickles',
  SEAFOOD: 'seafood',
} as const

export const ORDER_STATUSES = [
  'Pending',
  'Paid',
  'Preparing', 
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded',
] as const

export const DELIVERY_ZONES = [
  { name: 'Local (1-2 days)', fee: 50, min_order: 500 },
  { name: 'Metro (3-4 days)', fee: 100, min_order: 1000 },
  { name: 'National (5-7 days)', fee: 150, min_order: 1500 },
] as const

export const PAYMENT_METHODS = {
  PHONEPE: 'phonepe',
  COD: 'cod',
} as const

export const MAX_CART_ITEMS = 10
export const MIN_ORDER_AMOUNT = 500
export const FREE_SHIPPING_THRESHOLD = 2000

export const CONTACT_INFO = {
  phone: '+91-9876543210',
  email: 'hello@desawali.com',
  address: '123 Spice Street, Food District, Mumbai 400001',
  hours: 'Mon-Sat: 9 AM - 8 PM',
} as const