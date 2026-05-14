import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserRightsProvider } from './context/UserRightsContext'
import ProtectedRoute from './components/ProtectedRoute'
import { useRights } from './context/UserRightsContext'
import AppShell from './layouts/AppShell'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import SalesListPage from './pages/SalesListPage'
import CustomerLookupPage from './pages/lookups/CustomerLookupPage'
import EmployeeLookupPage from './pages/lookups/EmployeeLookupPage'
import ProductLookupPage from './pages/lookups/ProductLookupPage'
import PriceHistoryPage from './pages/lookups/PriceHistoryPage'

function DeletedItemsGuard() {
  const { userType, loading } = useRights()
  if (loading) return <div>Loading...</div>
  if (userType === 'USER') return <Navigate to="/sales" />
  return <div>Deleted Items Page</div>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages — no navbar/sidebar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* App pages — wrapped with AppShell (shows navbar + sidebar) */}
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/sales" element={<SalesListPage />} />
        <Route path="/lookups/customers" element={<CustomerLookupPage />} />
        <Route path="/lookups/employees" element={<EmployeeLookupPage />} />
        <Route path="/lookups/products" element={<ProductLookupPage />} />
        <Route path="/lookups/prices" element={<PriceHistoryPage />} />
        <Route path="/reports" element={<div>Reports Page</div>} />
        <Route path="/admin" element={<div>Admin Page</div>} />
        <Route path="/deleted-items" element={<DeletedItemsGuard />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserRightsProvider>
          <AppRoutes />
        </UserRightsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}