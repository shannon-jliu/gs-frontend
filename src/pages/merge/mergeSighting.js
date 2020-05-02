import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'

import MergeSightingPreview from './mergeSightingPreview.js'

const MergeSighting = ({ sighting, dragging, onDragStart, onDragEnd, onDrag }) => {
  // capitalization for display purposes only
  const shape = sighting.get('shape').charAt(0).toUpperCase() + sighting.get('shape').substr(1)
  const shapeColor = sighting.get('shapeColor').charAt(0).toUpperCase() + sighting.get('shapeColor').substr(1)
  const alphaColor = sighting.get('alphaColor').charAt(0).toUpperCase() + sighting.get('alphaColor').substr(1)

  return (
    <div
      className="sighting card z-depth-2"
      style={dragging ? {opacity: 0.15} : {}}>
      <MergeSightingPreview
        isThumbnail={false}
        isMerged={false}
        sighting={sighting}
        onDragStart={onDragStart === undefined ? undefined : () => onDragStart(sighting)}
        onDragEnd={onDragEnd}
        onDrag={onDrag}
        dragging={dragging} />
      <div className="fact-container">
        <div className="fact">Shape: {shape}</div>
        <div className="fact">Shape Color: {shapeColor}</div>
        <div className="fact">Alpha: {sighting.get('alpha')}</div>
        <div className="fact">Alpha Color: {alphaColor}</div>
      </div>
    </div>
  )
}

MergeSighting.propTypes = {
  sighting: ImmutablePropTypes.map.isRequired,
  dragging: PropTypes.bool.isRequired,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func
}

export default MergeSighting
