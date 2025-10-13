import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck, Clock, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import type { Product, Category } from '../types'

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        // Fetch featured products
        const { data: productsData } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('is_active', true)
          .limit(8)

        setCategories(categoriesData || [])
        setFeaturedProducts(productsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-cream-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Premium <span className="text-primary-600">Pickles</span> & 
                  <span className="block text-seafood-600">Fresh Seafood</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover authentic flavors with our handcrafted pickles and ocean-fresh seafood. 
                  Delivered straight to your doorstep with love and tradition.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button size="lg" className="group">
                    Shop Now 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>100% Fresh</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <span>Free Delivery</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                    alt="Premium Pickles"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                  <img
                    src="https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg"
                    alt="Fresh Prawns"
                    className="w-full h-32 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"
                    alt="Spicy Pickles"
                    className="w-full h-32 object-cover rounded-2xl shadow-lg"
                  />
                  <img
                    src="https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg"
                    alt="Fresh Fish"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white px-6 py-4 rounded-2xl shadow-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold">2000+</p>
                  <p className="text-sm">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated selection of premium products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-seafood-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 capitalize">
                      {category.name}
                    </h3>
                    <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center text-primary-600 font-medium">
                    Shop {category.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked favorites loved by our customers
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="hidden sm:flex">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/shop">
              <Button variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Desawali?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering the finest quality products with exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:bg-primary-200 transition-colors">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Handpicked ingredients and traditional recipes ensure authentic taste in every bite
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-seafood-100 rounded-full mb-6 group-hover:bg-seafood-200 transition-colors">
                <Clock className="h-8 w-8 text-seafood-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Fresh Daily
              </h3>
              <p className="text-gray-600">
                Our seafood is caught fresh daily and pickles are made in small batches weekly
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Same-day delivery in metro cities and next-day delivery nationwide
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6 group-hover:bg-yellow-200 transition-colors">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                5-Star Service
              </h3>
              <p className="text-gray-600">
                Rated 4.8/5 by thousands of satisfied customers across India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to taste tradition?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of satisfied customers and experience the authentic flavors of India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                Start Shopping
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home