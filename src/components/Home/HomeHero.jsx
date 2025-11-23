import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faShield } from '@fortawesome/free-solid-svg-icons'

export default function HomeHero({ title, subtitle, primaryAction, secondaryAction }) {
  return (
    <div className="home-hero">
      <div className="home-hero-logo">
        <FontAwesomeIcon icon={faShield} />
      </div>
      <h1 className="home-hero-title">{title}</h1>
      <p className="home-hero-subtitle">{subtitle}</p>
      <div className="home-hero-actions">
        {primaryAction && (
          <a href={primaryAction.href} className="home-hero-button home-hero-button-primary">
            {primaryAction.label}
            <FontAwesomeIcon icon={faChevronRight} />
          </a>
        )}
        {secondaryAction && (
          <a href={secondaryAction.href} className="home-hero-button home-hero-button-secondary">
            {secondaryAction.label}
          </a>
        )}
      </div>
    </div>
  )
}

