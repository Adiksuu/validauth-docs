import { BrowserRouter } from "react-router-dom"
import { useState, useEffect } from "react"
import Router from "./views/Router"
import Sidebar from "./components/Sidebar/Sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when clicking overlay
  const handleOverlayClick = () => {
    setSidebarOpen(false)
  }

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return (
    <BrowserRouter>
        <main>
            <button 
                className="mobile-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div 
                className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={handleOverlayClick}
            />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Router />
        </main>
    </BrowserRouter>
  )
}

export default App
