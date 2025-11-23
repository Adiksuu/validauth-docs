import React from 'react'
import HomeFeatureCard from './HomeFeatureCard'
import { faStar } from '@fortawesome/free-regular-svg-icons'

export default function HomeFeatures({ features }) {
  return (
    <div className="home-features">
      {features.map((feature, index) => (
        <HomeFeatureCard
          key={index}
          icon={feature.icon || faStar}
          title={feature.title}
          description={feature.description}
          link={feature.link}
        />
      ))}
    </div>
  )
}

