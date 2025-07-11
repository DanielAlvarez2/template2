import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from './components/Home.jsx'
import App from './components/App.jsx'
import Allergies from './components/Allergies.jsx'

export default function Client(){
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/app' element={<App />} />
                    <Route path='/allergies' element={<Allergies />} />
                </Routes>
            
            </BrowserRouter>
        </>
    )
}