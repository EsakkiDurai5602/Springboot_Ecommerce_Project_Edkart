import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';

// Layouts
import { StoreLayout } from './components/layout/StoreLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminRoute } from './components/layout/AdminRoute';

// Storefront Pages
import { HomePage } from './features/home/HomePage';
import { ShopPage } from './features/shop/ShopPage';
import { ProductDetailPage } from './features/product/ProductDetailPage';
import { CartPage } from './features/cart/CartPage';
import { CheckoutPage } from './features/checkout/CheckoutPage';
import { OrderSuccessPage } from './features/orders/OrderSuccessPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

// Admin Pages
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { AdminProductsPage } from './features/admin/AdminProductsPage';
import { AdminOrdersPage } from './features/admin/AdminOrdersPage';

// System
import { NotFoundPage } from './features/system/NotFoundPage';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Storefront Routes */}
                <Route element={<StoreLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders/success/:orderNo" element={<OrderSuccessPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Operations Admin Portal Routes */}
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  </Route>
                </Route>

                {/* Fallback 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
