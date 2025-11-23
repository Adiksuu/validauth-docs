import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function HomeFeatureCard({ icon, title, description, link }) {
  return (
    <div className="home-feature-card">
      {icon && (
        <div className="home-feature-card-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <h3 className="home-feature-card-title">{title}</h3>
      <p className="home-feature-card-description">{description}</p>
      {link && (
        <a href={link.href} className="home-feature-card-link">
          {link.label}
          <FontAwesomeIcon icon={faChevronRight} />
        </a>
      )}
    </div>
  )
}

