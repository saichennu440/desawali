import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCartContext } from '../context/CartContext'
import { formatCurrency } from '../utils/helpers'
import Button from '../components/ui/Button'
import ProductCard from '../components/ui/ProductCard'
import type { Product } from '../types'

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem, getItem } = useCartContext()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      
      // Fetch product by slug
      const { data: productData, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      
      setProduct(productData)

      // Fetch related products from same category
      if (productData?.category_id) {
        const { data: relatedData } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('category_id', productData.category_id)
          .eq('is_active', true)
          .neq('id', productData.id)
          .limit(4)

        setRelatedProducts(relatedData || [])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/404')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      unit: product.unit,
      image_url: product.images[0],
    }, quantity)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.inventory || 0)) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    if (product && selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.inventory <= 0
  const cartItem = getItem(product.id)
  const isInCart = !!cartItem

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <span>/</span>
          <span className="capitalize">{product.category?.name}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={product.images[selectedImageIndex] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={selectedImageIndex === 0}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={selectedImageIndex === product.images.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Product Badges */}
              {product.metadata?.badge && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
                    {product.metadata.badge}
                  </span>
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium text-lg bg-gray-800 px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.5) • 32 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-lg text-gray-600">per {product.unit}</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Ingredients/Metadata */}
            {product.metadata?.ingredients && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.metadata.ingredients.map((ingredient: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Spice Level */}
            {product.metadata?.spice_level && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Spice Level</h3>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  product.metadata.spice_level === 'Hot' 
                    ? 'bg-red-100 text-red-800'
                    : product.metadata.spice_level === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.metadata.spice_level}
                </span>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.inventory > 10 ? 'bg-green-500' : 
                product.inventory > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600">
                {product.inventory > 10 
                  ? 'In Stock' 
                  : product.inventory > 0 
                  ? `Only ${product.inventory} left` 
                  : 'Out of Stock'
                }
              </span>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {!isOutOfStock && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.inventory}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {isInCart ? `Add More (${cartItem.quantity} in cart)` : 'Add to Cart'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="px-4"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  
                  <Button variant="outline" className="px-4">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quality Guaranteed</p>
                    <p className="text-sm text-gray-600">100% fresh & authentic</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Fast Delivery</p>
                    <p className="text-sm text-gray-600">Same day in metro cities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductPage