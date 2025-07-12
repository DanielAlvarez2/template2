import { StrictMode } from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'
import Home from './components/Home.jsx'
import Allergies from './components/Allergies.jsx'
import Client from './Client.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
