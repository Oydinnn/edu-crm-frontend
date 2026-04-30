import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Students from './pages/Students'
import Subjects from './pages/Subjects'
import Settings from './pages/Settings'



function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/students" element={<Students />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
