
import { useState } from 'react';
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import  supabase  from './utils/supabase.js'
import './App.css';
import Create from './Components/Create/Create';
import Footer from './Components/Footer/Footer';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Create />
      <Footer />
    </>
  );
}
  export default App;