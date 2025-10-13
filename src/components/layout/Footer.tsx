import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react'
import { CONTACT_INFO } from '../../utils/constants'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold">Desawali</span>
            </div>
            <p className="text-gray-300 text-sm">
              Premium quality pickles and fresh seafood delivered to your doorstep. 
              Taste the authentic flavors of tradition.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                to="/shop"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Shop All Products
              </Link>
              <Link
                to="/shop?category=pickles"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Pickles
              </Link>
              <Link
                to="/shop?category=seafood"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Fresh Seafood
              </Link>
              <Link
                to="/about"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                About Us
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <nav className="space-y-2">
              <Link
                to="/contact"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link
                to="/shipping"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Shipping Info
              </Link>
              <Link
                to="/returns"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Returns & Exchanges
              </Link>
              <Link
                to="/faq"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {CONTACT_INFO.address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {CONTACT_INFO.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {CONTACT_INFO.email}
                </span>
              </div>
              <div className="text-gray-300 text-sm">
                <p className="font-medium">Store Hours:</p>
                <p>{CONTACT_INFO.hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-gray-300 text-sm">
              <span>&copy; 2024 Desawali. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>in India</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer