import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StoreProvider } from 'easy-peasy'
import store from './state/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </StrictMode>,
)
