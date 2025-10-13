import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { BarChart3, Package, ShoppingCart, Users, Settings, Plus, TrendingUp, DollarSign, Eye, CreditCard as Edit, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatCurrency, formatDate } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import type { Product } from '../../types'
import type { Database } from '../../types/database'

type Order = Database['public']['Tables']['orders']['Row']

const AdminDashboard: React.FC = () => {
  const location = useLocation()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      // Calculate stats (simplified for demo)
      const { data: allOrders } = await supabase
        .from('orders')
        .select('total, status')

      const { data: allProducts } = await supabase
        .from('products')
        .select('id')

      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id')

      const totalRevenue = allOrders?.reduce((sum, order) => sum + order.total, 0) || 0
      
      setStats({
        totalOrders: allOrders?.length || 0,
        totalRevenue,
        totalProducts: allProducts?.length || 0,
        totalCustomers: allProfiles?.length || 0,
      })

      setRecentOrders(ordersData || [])
      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store and monitor performance</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <Link
              to="/admin"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                location.pathname === '/admin'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Overview
            </Link>
            <Link
              to="/admin/products"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                location.pathname.includes('/admin/products')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                location.pathname.includes('/admin/orders')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShoppingCart className="h-4 w-4 inline mr-2" />
              Orders
            </Link>
            <Link
              to="/admin/customers"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                location.pathname.includes('/admin/customers')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Customers
            </Link>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12% from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8% from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-600">Active products</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-seafood-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-seafood-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+15% from last month</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link to="/admin/orders">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                    <Link to="/admin/products">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={product.images[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.title}</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {product.category?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(product.price)}
                          </p>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          } />
          
          <Route path="/products" element={
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Products Management</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </div>
              <p className="text-gray-600">Product management interface coming soon...</p>
            </div>
          } />
          
          <Route path="/orders" element={
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Orders Management</h2>
              <p className="text-gray-600">Order management interface coming soon...</p>
            </div>
          } />
          
          <Route path="/customers" element={
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Management</h2>
              <p className="text-gray-600">Customer management interface coming soon...</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard