import react from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <react.StrictMode>
    <App />
  </react.StrictMode>,
)
