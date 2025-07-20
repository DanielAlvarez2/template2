import ReactDOM from 'react-dom/client'
import React from 'react'
import { BrowserRouter,Routes,Route } from "react-router"
import './index.css'
import App from './components/App.jsx'
import Home from './components/Home.jsx'
import Allergies from './components/Allergies.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='home' element={<Home />} />
        <Route path='allergies' element={<Allergies />} />
      </Routes>
    </BrowserRouter>
  
)
