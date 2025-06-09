import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import ArtistDetail from './pages/ArtistDetail'
import UserProfile from './pages/UserProfile'
import NotFound from './pages/NotFound'
function App() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') !== 'false'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

return (
    <div className="min-h-screen bg-black text-white">
<Routes>
        <Route path="/" element={<Home toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App