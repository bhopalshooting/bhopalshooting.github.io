import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/app.css'

const pathname = window.location.pathname
const app = (
  <StrictMode>
    <App pathname={pathname} />
  </StrictMode>
)
const root = document.getElementById('root')!

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
