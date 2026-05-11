import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallbackPage from './pages/AuthCallbackPage'

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
          <Route path="/sales" element={<div>Sales Page</div>} />
          <Route path="/lookups/customers" element={<div>Customers Page</div>} />
          <Route path="/lookups/employees" element={<div>Employees Page</div>} />
          <Route path="/lookups/products" element={<div>Products Page</div>} />
          <Route path="/lookups/prices" element={<div>Price History Page</div>} />
          <Route path="/reports" element={<div>Reports Page</div>} />
          <Route path="/admin" element={<div>Admin Page</div>} />
          <Route path="/deleted-items" element={<div>Deleted Items Page</div>} />
        </Route>

        {/* Default */}
        <Route path="*" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  )
}