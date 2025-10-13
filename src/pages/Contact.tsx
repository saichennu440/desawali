import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { CONTACT_INFO } from '../utils/constants'
import { isValidEmail, isValidPhone } from '../utils/helpers'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-xl shadow-sm p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} className="w-full">
            Send Another Message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-cream-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Reach out to us through any of these channels. We're here to help with 
                  your questions about orders, products, or anything else.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">{CONTACT_INFO.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-seafood-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-seafood-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">{CONTACT_INFO.phone}</p>
                    <p className="text-sm text-gray-500">Call us for immediate assistance</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{CONTACT_INFO.email}</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Store Hours</h3>
                    <p className="text-gray-600">{CONTACT_INFO.hours}</p>
                    <p className="text-sm text-gray-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Questions?
                </h3>
                <p className="text-gray-600 mb-4">
                  Check our FAQ section for instant answers to common questions about 
                  orders, shipping, and our products.
                </p>
                <Button variant="outline">
                  Visit FAQ
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={errors.name}
                    placeholder="Enter your name"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={errors.email}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    error={errors.phone}
                    placeholder="Enter your phone (optional)"
                  />
                  <Input
                    label="Subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange('subject')}
                    error={errors.subject}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    placeholder="Tell us more about your inquiry..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact