import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartSidebar from './components/cart/CartSidebar'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import Orders from './pages/Orders'
import Auth from './pages/Auth'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/admin/Dashboard'
//import NotFound from './pages/NotFound'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-cream-100 flex flex-col">
          <Header />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />

              {/* 404 */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </main>

          <Footer />
          <CartSidebar />
        </div>
      </CartProvider>
    </Router>
  )
}

export default App