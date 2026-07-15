import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const StudioRoute = lazy(() => import('./admin/StudioRoute.tsx'))
const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

createRoot(document.getElementById('root')!).render(
  isAdminRoute ? (
    <Suspense fallback={null}>
      <StudioRoute />
    </Suspense>
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
)
