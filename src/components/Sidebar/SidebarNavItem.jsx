import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SidebarNavItem({ path, label, onClick }) {
  const location = useLocation()
  const fullPath = `/docs${path}`
  const active = location.pathname === fullPath

  const handleClick = () => {
    // Close sidebar on mobile when item is clicked
    if (onClick && window.innerWidth <= 768) {
      onClick()
    }
  }

  return (
    <Link 
      to={fullPath} 
      className={`sidebar-nav-item ${active ? 'active' : ''}`}
      onClick={handleClick}
    >
      {label}
    </Link>
  )
}

