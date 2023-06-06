import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes'
import TRPCProvider from './contexts/TRPC/trpc';
import { AuthProvider } from './contexts/Auth/AuthContext';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <TRPCProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </TRPCProvider>
    </AuthProvider>
  </React.StrictMode>,
)
