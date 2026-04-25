import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CustomStudioPage from './pages/CustomStudioPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomizePage from './pages/CustomizePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminDesignsPage from './pages/admin/AdminDesignsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/custom-studio" element={<CustomStudioPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/customize/:id" element={<ProtectedRoute><CustomizePage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        <Route path="/admin/login" element={<AuthPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProductsPage /></ProtectedRoute>} />
        <Route path="/admin/products/new" element={<ProtectedRoute adminOnly><AdminProductFormPage /></ProtectedRoute>} />
        <Route path="/admin/products/:id/edit" element={<ProtectedRoute adminOnly><AdminProductFormPage /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute>} />
        <Route path="/admin/designs" element={<ProtectedRoute adminOnly><AdminDesignsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
