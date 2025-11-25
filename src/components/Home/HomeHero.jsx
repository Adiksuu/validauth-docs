import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faShield } from '@fortawesome/free-solid-svg-icons'
import checkForUpdates from '../../functions/getVersion';
import { faReadme } from '@fortawesome/free-brands-svg-icons';

export default function HomeHero({ title, subtitle, primaryAction, secondaryAction, thirdAction }) {
    const [packageVersion, setPackageVersion] = useState('Latest');

    useEffect(() => {
        async function fetchVersion() {
            const version = await checkForUpdates();
            setPackageVersion(version);
        }
        fetchVersion();
    }, [])

  return (
    <div className="home-hero">
      <div className="home-hero-logo">
        <FontAwesomeIcon icon={faShield} />
      </div>
      <h1 className="home-hero-title">{title} <span>{packageVersion}</span></h1>
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
        {thirdAction && (
          <a href={thirdAction.href} className="home-hero-button home-hero-button-primary">
            {thirdAction.label}
            <FontAwesomeIcon icon={faReadme} />
          </a>
        )}
      </div>
    </div>
  )
}

