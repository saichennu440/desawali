import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartContext } from '../context/CartContext'
import { formatCurrency, calculateShipping, calculateTax } from '../utils/helpers'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Cart: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotal,
    getItemCount 
  } = useCartContext()

  const subtotal = getTotal()
  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  const total = subtotal + shipping + tax
  const itemCount = getItemCount()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any delicious items to your cart yet.
            </p>
            <Link to="/shop">
              <Button size="lg">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex items-center space-x-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.price)} per {item.unit}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="mt-1 p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="text-center">
              <Link to="/shop">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Code</h3>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                />
                <Button variant="outline" className="w-full">
                  Apply Coupon
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 2000 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Add {formatCurrency(2000 - subtotal)} more for free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <div className="mt-6">
                <Link to="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Secure checkout with 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Same-day delivery in metro cities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Next-day delivery nationwide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Free shipping on orders above ₹2000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart