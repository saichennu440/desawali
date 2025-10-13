import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  LogOut,
  Package,
  Settings
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import Button from '../ui/Button'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, profile, signOut, isAdmin } = useAuth()
  const { getItemCount, setIsOpen: setCartOpen } = useCart()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const cartItemCount = getItemCount()

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Desawali</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {/* <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </button> */}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {profile?.full_name?.[0] || user.email?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700">
                    {profile?.full_name || 'Account'}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/account"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Link>
                    
                    <Link
                      to="/account/orders"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      <span>Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header