import React from 'react'
import SidebarNavItem from './SidebarNavItem'

export default function SidebarNavSection({ title, items, onItemClick }) {
  return (
    <div className="sidebar-nav-section">
      <div className="sidebar-nav-section-title">{title}</div>
      <div className="sidebar-nav-section-items">
        {items.map((item, index) => (
          <SidebarNavItem
            key={index}
            path={item.path}
            label={item.label}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  )
}

