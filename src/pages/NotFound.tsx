import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
          <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <div className="text-primary-600 text-4xl">🥒</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              The page you're looking for seems to have gone fishing! 
              Perhaps it's searching for the perfect pickle recipe.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <div className="text-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Go Back
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Or explore our popular sections:
            </p>
            <div className="space-y-2">
              <Link
                to="/shop"
                className="block text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Shop All Products
              </Link>
              <Link
                to="/shop?category=pickles"
                className="block text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Premium Pickles
              </Link>
              <Link
                to="/shop?category=seafood"
                className="block text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Fresh Seafood
              </Link>
              <Link
                to="/contact"
                className="block text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound