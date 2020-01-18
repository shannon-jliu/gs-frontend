import React from 'react'
import PropTypes from 'prop-types'

const ImageSighting = ({ heightWidth, imageUrl, imgWidth, imgHeight, compressedWidth, compressedHeight, sighting }) => {
  const radius = heightWidth / 2
  const imgscale = heightWidth / sighting.get('width')
  const bgSize = imgWidth * imgscale + 'px ' + imgHeight * imgscale + 'px'
  /* The following calculations for x and y are calculating the offset of the fully-sized/uncompressed image that
    will be displayed as the background image for the actual image sighting. The ratio involved a compressed dimension
    (such as compressedWidth) compensate for the difference in dimensions between the compressed image that is displayed
    in the image viewer and the uncompressed image that is used for the image sighting. The heightWidth/2 is dealing with moving
    the background image relative to the center of the image sighting, which is 330px by 306.25px. */
  let x = heightWidth/2 - sighting.get('pixel_x') * (imgWidth/compressedWidth) * imgscale
  let y = heightWidth/2 - sighting.get('pixel_y') * (imgHeight/compressedHeight) * imgscale
  const drawOrientationLine = sighting.has('radiansFromTop')
  const orientationX = radius + radius * Math.sin(sighting.get('radiansFromTop'))
  const orientationY = heightWidth - (radius + radius * Math.cos(sighting.get('radiansFromTop')))

  return(
    <div
      className='image'
      style={{
        width: '100%',
        height: '0',
        paddingBottom: '100%',
        backgroundImage: 'url(' + imageUrl + ')',
        backgroundSize: bgSize,
        backgroundPosition: x + 'px ' + y + 'px',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* line shows orientation of target sighting */}
      {/* svg is always required as it gives the div size to display the image */}
      <svg height={heightWidth} width={heightWidth}>
        {
          drawOrientationLine ?
            <line
              x1={radius}
              y1={radius}
              x2={orientationX}
              y2={orientationY}
              style={{
                stroke: '#f44336',
                strokeWidth: 2
              }}
            /> : null
        }
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
  compressedWidth: PropTypes.number.isRequired,
  compressedHeight: PropTypes.number.isRequired,
  sighting: PropTypes.object.isRequired
}

export default ImageSighting
