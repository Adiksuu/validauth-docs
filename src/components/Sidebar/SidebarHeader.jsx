import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SidebarHeader({ logo, version }) {
    const navigate = useNavigate()
  return (
    <div className="sidebar-header">
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        {logo || 'validauth'}
      </div>
      {version && (
        <button className="sidebar-version" onClick={() => window.open('https://github.com/Adiksuu/validauth/releases/latest', '_blank')}>
          {version}
        </button>
      )}
    </div>
  )
}

