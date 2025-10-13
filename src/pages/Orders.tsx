import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ArrowLeft,
  Eye,
  Download
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatCurrency, formatDate } from '../utils/helpers'
import Button from '../components/ui/Button'
import type { Database } from '../types/database'

type Order = Database['public']['Tables']['orders']['Row']

const Orders: React.FC = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const success = searchParams.get('success')

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'Paid':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'Preparing':
        return <Package className="h-5 w-5 text-orange-500" />
      case 'Shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'Refunded':
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Paid':
        return 'bg-blue-100 text-blue-800'
      case 'Preparing':
        return 'bg-orange-100 text-orange-800'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'Refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/account"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Account
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">
                  Order placed successfully! We'll send you updates via email.
                </span>
              </div>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              When you place your first order, it will appear here.
            </p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Order #{order.id.slice(0, 8)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(order.total)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {selectedOrder?.id === order.id ? 'Hide' : 'View'} Details
                      </Button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{Array.isArray(order.items) ? order.items.length : 0} items</span>
                    <span>•</span>
                    <span>
                      Delivery to {
                        typeof order.shipping_address === 'object' && order.shipping_address !== null
                          ? (order.shipping_address as any).city
                          : 'N/A'
                      }
                    </span>
                    {order.phonepe_payment_id && (
                      <>
                        <span>•</span>
                        <span>Payment ID: {order.phonepe_payment_id.slice(0, 12)}...</span>
                      </>
                    )}
                  </div>

                  {/* Expanded Order Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
                          <div className="space-y-4">
                            {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                              <div key={index} className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    {formatCurrency(item.price)} × {item.qty} {item.unit}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                                    {formatCurrency(item.price * item.qty)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary & Shipping */}
                        <div className="space-y-6">
                          {/* Order Summary */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>{formatCurrency(order.shipping)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>{formatCurrency(order.tax)}</span>
                              </div>
                              <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span>{formatCurrency(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                            {typeof order.shipping_address === 'object' && order.shipping_address !== null && (
                              <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">
                                  {(order.shipping_address as any).full_name}
                                </p>
                                <p>{(order.shipping_address as any).address_line_1}</p>
                                {(order.shipping_address as any).address_line_2 && (
                                  <p>{(order.shipping_address as any).address_line_2}</p>
                                )}
                                <p>
                                  {(order.shipping_address as any).city}, {(order.shipping_address as any).state} {(order.shipping_address as any).postal_code}
                                </p>
                                <p>{(order.shipping_address as any).country}</p>
                                {(order.shipping_address as any).phone && (
                                  <p>Phone: {(order.shipping_address as any).phone}</p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Order Notes */}
                          {order.notes && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Notes</h3>
                              <p className="text-sm text-gray-600">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                        
                        {order.status === 'Delivered' && (
                          <Button variant="outline" size="sm">
                            Reorder Items
                          </Button>
                        )}
                        
                        {['Pending', 'Paid'].includes(order.status) && (
                          <Button variant="outline" size="sm">
                            Cancel Order
                          </Button>
                        )}
                        
                        {order.status === 'Delivered' && (
                          <Button variant="outline" size="sm">
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders