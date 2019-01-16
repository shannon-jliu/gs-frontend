import React from 'react'
import PropTypes from 'prop-types'

const ImageSighting = ({ heightWidth, imgWidth, imgHeight, imageUrl, sighting }) => {
  const radius = heightWidth / 2
  const imgscale = heightWidth / sighting.get('width')
  const bgSize = imgWidth * imgscale + 'px ' + imgHeight * imgscale + 'px'
  const x = radius - sighting.get('pixelX') * imgscale
  const y = radius - sighting.get('pixelY') * imgscale
  const orientationX = radius + radius * Math.sin(sighting.get('radiansFromTop'))
  const orientationY = heightWidth - (radius + radius * Math.cos(sighting.get('radiansFromTop')))
  return(
    <div
      className='image'
      style={{
        backgroundImage: 'url(' + imageUrl + ')',
        backgroundSize: bgSize,
        backgroundPosition: x + 'px ' + y + 'px'
      }}
    >
      {/* line shows orientation of target sighting */}
      <svg height={heightWidth} width={heightWidth}>
        <line
          x1={radius}
          y1={radius}
          x2={orientationX}
          y2={orientationY}
          style={{
            stroke: '#f44336',
            strokeWidth: 2
          }}
        />
        &nbsp;
      </svg>
    </div>
  )
}

ImageSighting.propTypes = {
  heightWidth: PropTypes.number.isRequired,
  imgWidth: PropTypes.number.isRequired,
  imgHeight: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  sighting: PropTypes.object.isRequired
}

export default ImageSighting
