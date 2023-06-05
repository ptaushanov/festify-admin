import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import Routes from './Routes'
import TRPCProvider from './components/TRPC/trpc';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TRPCProvider>
      <BrowserRouter>
        <SidebarLayout>
          <Routes />
        </SidebarLayout>
      </BrowserRouter>
    </TRPCProvider>
  </React.StrictMode>,
)
