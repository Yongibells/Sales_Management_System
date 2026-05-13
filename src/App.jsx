import DeletedItemsPage from './pages/DeletedItemsPage'
import SalesListPage from './pages/SalesListPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import CustomerLookupPage from './pages/lookups/CustomerLookupPage'
import EmployeeLookupPage from './pages/lookups/EmployeeLookupPage'
import ProductLookupPage from './pages/lookups/ProductLookupPage'
import PriceHistoryPage from './pages/lookups/PriceHistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth pages — no navbar/sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* App pages — wrapped with AppShell (shows navbar + sidebar) */}
        <Route element={<AppShell />}>
          <Route path="/sales" element={<SalesListPage />} />
          <Route path="/lookups/customers" element={<CustomerLookupPage />} />
          <Route path="/lookups/employees" element={<EmployeeLookupPage />} />
          <Route path="/lookups/products" element={<ProductLookupPage />} />
          <Route path="/lookups/prices" element={<PriceHistoryPage />} />
          <Route path="/reports" element={<div>Reports Page</div>} />
          <Route path="/admin" element={<div>Admin Page</div>} />
          <Route path="/deleted-items" element={<DeletedItemsPage />} />
        </Route>

        {/* Default */}
        <Route path="*" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  )
}