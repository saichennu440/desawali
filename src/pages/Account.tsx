import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Settings, LogOut, CreditCard as Edit2, Save, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { isValidPhone } from '../utils/helpers'

interface ProfileFormData {
  full_name: string
  phone: string
}

const Account: React.FC = () => {
  const { user, profile, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const { error } = await updateProfile(formData)
      if (error) {
        setErrors({ submit: error.message })
      } else {
        setIsEditing(false)
        setErrors({})
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ submit: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    })
    setIsEditing(false)
    setErrors({})
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <nav className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </div>
                
                <Link
                  to="/account/orders"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <MapPin className="h-5 w-5" />
                  <span>Addresses</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      loading={loading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-2xl font-bold">
                      {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {profile?.full_name || 'User'}
                    </h3>
                    <p className="text-gray-600">{user?.email}</p>
                    {profile?.is_admin && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    value={isEditing ? formData.full_name : (profile?.full_name || '')}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    error={errors.full_name}
                    disabled={!isEditing}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    helperText="Email cannot be changed"
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={isEditing ? formData.phone : (profile?.phone || '')}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Status
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 mb-1">0</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">₹0</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
                  <div className="text-sm text-gray-600">Saved Items</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/account/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-5 w-5 mr-3" />
                    View Order History
                  </Button>
                </Link>
                
                <Link to="/shop">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-5 w-5 mr-3" />
                    Continue Shopping
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-5 w-5 mr-3" />
                  Manage Addresses
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-5 w-5 mr-3" />
                  Account Settings
                </Button>
              </div>
            </div>

            {/* Admin Panel Access */}
            {profile?.is_admin && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Access</h3>
                    <p className="text-gray-600">
                      You have administrator privileges. Access the admin dashboard to manage products and orders.
                    </p>
                  </div>
                  <Link to="/admin">
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account