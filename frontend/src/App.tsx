import Home from './page/Home'
import { Routes, Route } from "react-router-dom"
import Dashboard from './page/Dashboard'

function App() {

  return (
    <main className='w-full h-full min-h-screen flex items-center justify-center'>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </main>
  )
}

export default App
