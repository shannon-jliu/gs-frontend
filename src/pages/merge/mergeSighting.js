import * as _ from 'lodash'

import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'

import MergeSightingPreview from './mergeSightingPreview.js'

const MergeSighting = ({ sighting, dragging, onDragStart, onDragEnd }) => {
  const shape = _.capitalize(sighting.get('shape'))
  const shapeColor = _.capitalize(sighting.get('shapeColor'))
  const alpha = _.capitalize(sighting.get('alpha'))
  const alphaColor = _.capitalize(sighting.get('alphaColor'))

  return (
    <div
      className="sighting"
      style={dragging ? { opacity: 0.15 } : {}}>
      <MergeSightingPreview
        isThumbnail={false}
        isMerged={false}
        sighting={sighting}
        onDragStart={onDragStart === undefined ? undefined : () => onDragStart(sighting)}
        onDragEnd={onDragEnd}
        dragging={dragging} />
      <ul className="sighting-attributes">
        <li>
          <span class="caption">Shape</span>
          <p>{shapeColor} {shape}</p>
        </li>
        <li>
          <span class="caption">Alpha</span>
          <p>{alphaColor} {alpha}</p>
        </li>
      </ul>
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
