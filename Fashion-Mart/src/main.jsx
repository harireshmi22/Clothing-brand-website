import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';  // This will include Tailwind's styles
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
