import { useState } from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
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
