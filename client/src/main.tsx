import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes'
import TRPCProvider from './components/TRPC/trpc';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TRPCProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </TRPCProvider>
  </React.StrictMode>,
)
