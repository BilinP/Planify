import { useState } from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import reactLogo from './assets/icon/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import  supabase  from './utils/supabase.js'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path= "/" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
