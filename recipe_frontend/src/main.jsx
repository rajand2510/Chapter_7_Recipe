import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './Context/AuthContext.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <ErrorBoundary>
    <AuthProvider>
    <App />
    </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
  </BrowserRouter>,
)
