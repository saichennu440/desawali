import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, User, Phone, Mail, Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCartContext } from '../context/CartContext'
import { formatCurrency, calculateShipping, calculateTax, isValidEmail, isValidPhone } from '../utils/helpers'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import type { ShippingAddress } from '../types'

interface CheckoutFormData {
  email: string
  phone: string
  shippingAddress: ShippingAddress
  paymentMethod: 'phonepe' | 'cod'
  notes: string
}

interface FormErrors {
  [key: string]: string
}

const Checkout: React.FC = () => {
  const { user, profile } = useAuth()
  const { items, getTotal, clearCart } = useCartContext()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || '',
    phone: profile?.phone || '',
    shippingAddress: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
    },
    paymentMethod: 'phonepe',
    notes: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const subtotal = getTotal()
  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  const total = subtotal + shipping + tax

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      // Contact Information
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required'
      } else if (!isValidPhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number'
      }
    }

    if (step === 2) {
      // Shipping Address
      const { shippingAddress } = formData
      if (!shippingAddress.full_name.trim()) {
        newErrors['shippingAddress.full_name'] = 'Full name is required'
      }
      if (!shippingAddress.address_line_1.trim()) {
        newErrors['shippingAddress.address_line_1'] = 'Address is required'
      }
      if (!shippingAddress.city.trim()) {
        newErrors['shippingAddress.city'] = 'City is required'
      }
      if (!shippingAddress.state.trim()) {
        newErrors['shippingAddress.state'] = 'State is required'
      }
      if (!shippingAddress.postal_code.trim()) {
        newErrors['shippingAddress.postal_code'] = 'Postal code is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('shippingAddress.')) {
      const addressField = field.replace('shippingAddress.', '')
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [addressField]: value,
        },
      })
    } else {
      setFormData({ ...formData, [field]: value })
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return

    setLoading(true)
    
    try {
      // Create order in database
      const orderData = {
        user_id: user?.id,
        items: items.map(item => ({
          product_id: item.product_id,
          title: item.title,
          qty: item.quantity,
          price: item.price,
          unit: item.unit,
          image_url: item.image_url,
        })),
        subtotal,
        shipping,
        tax,
        total,
        status: formData.paymentMethod === 'cod' ? 'Pending' : 'Pending',
        shipping_address: formData.shippingAddress,
        notes: formData.notes,
      }

      // TODO: Implement actual order creation API call
      console.log('Creating order:', orderData)

      if (formData.paymentMethod === 'phonepe') {
        // TODO: Integrate with PhonePe payment gateway
        console.log('Redirecting to PhonePe payment...')
        // Simulate payment success for now
        setTimeout(() => {
          clearCart()
          navigate('/account/orders?success=true')
        }, 2000)
      } else {
        // Cash on Delivery
        clearCart()
        navigate('/account/orders?success=true')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      setErrors({ submit: 'Failed to create order. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Contact', completed: currentStep > 1 },
    { number: 2, title: 'Shipping', completed: currentStep > 2 },
    { number: 3, title: 'Payment', completed: false },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.number === currentStep
                      ? 'bg-primary-600 text-white'
                      : step.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? '✓' : step.number}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step.number === currentStep ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-200 mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Mail className="h-6 w-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      placeholder="your@email.com"
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={errors.phone}
                      placeholder="9876543210"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleNextStep}>
                      Continue to Shipping
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <MapPin className="h-6 w-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Full Name"
                      type="text"
                      value={formData.shippingAddress.full_name}
                      onChange={(e) => handleInputChange('shippingAddress.full_name', e.target.value)}
                      error={errors['shippingAddress.full_name']}
                      placeholder="Enter full name"
                      required
                    />

                    <Input
                      label="Address Line 1"
                      type="text"
                      value={formData.shippingAddress.address_line_1}
                      onChange={(e) => handleInputChange('shippingAddress.address_line_1', e.target.value)}
                      error={errors['shippingAddress.address_line_1']}
                      placeholder="Street address, building, apartment"
                      required
                    />

                    <Input
                      label="Address Line 2 (Optional)"
                      type="text"
                      value={formData.shippingAddress.address_line_2 || ''}
                      onChange={(e) => handleInputChange('shippingAddress.address_line_2', e.target.value)}
                      placeholder="Landmark, area"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <Input
                        label="City"
                        type="text"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                        error={errors['shippingAddress.city']}
                        placeholder="City"
                        required
                      />
                      <Input
                        label="State"
                        type="text"
                        value={formData.shippingAddress.state}
                        onChange={(e) => handleInputChange('shippingAddress.state', e.target.value)}
                        error={errors['shippingAddress.state']}
                        placeholder="State"
                        required
                      />
                      <Input
                        label="Postal Code"
                        type="text"
                        value={formData.shippingAddress.postal_code}
                        onChange={(e) => handleInputChange('shippingAddress.postal_code', e.target.value)}
                        error={errors['shippingAddress.postal_code']}
                        placeholder="PIN Code"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back to Contact
                    </Button>
                    <Button onClick={handleNextStep}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CreditCard className="h-6 w-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-4">
                    {/* PhonePe Payment */}
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="phonepe"
                        checked={formData.paymentMethod === 'phonepe'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">PhonePe</span>
                          <div className="text-sm text-green-600 font-medium">Recommended</div>
                        </div>
                        <p className="text-sm text-gray-600">Pay securely with PhonePe UPI, Cards, or Wallet</p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">Cash on Delivery</span>
                        <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                      </div>
                    </label>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back to Shipping
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      loading={loading}
                      className="flex items-center"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {formData.paymentMethod === 'phonepe' ? 'Pay Now' : 'Place Order'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-base font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Secure Checkout</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout