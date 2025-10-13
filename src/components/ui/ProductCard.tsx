import React from 'react'
import { Star, Plus } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import { useCart } from '../../hooks/useCart'
import type { Product } from '../../types'
import Button from './Button'

interface ProductCardProps {
  product: Product
  onViewDetails?: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const { addItem, hasItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      product_id: product.id,
      title: product.title,
      price: product.price,
      unit: product.unit,
      image_url: product.images[0],
    })
  }

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product)
    }
  }

  const isOutOfStock = product.inventory <= 0
  const inCart = hasItem(product.id)

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Product Badge */}
      {product.metadata?.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
            {product.metadata.badge}
          </span>
        </div>
      )}

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-10 flex items-center justify-center">
          <span className="text-white font-medium text-sm bg-gray-800 px-3 py-1 rounded-full">
            Out of Stock
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 ml-1">
              4.5 (32)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              per {product.unit}
            </span>
          </div>
          
          <Button
            variant={inCart ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            {inCart ? 'Added' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard