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
        <button className="sidebar-version">
          {version}
        </button>
      )}
    </div>
  )
}

