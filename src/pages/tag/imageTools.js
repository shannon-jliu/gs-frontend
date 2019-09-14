import React from 'react'
import PropTypes from 'prop-types'

import Slider from './components/slider'

// any parent component of ImageTools needs to initialize M.Range
// (see tag.js for an example)
const ImageTools =  ({ getHandler, reset, brightness, contrast, saturation})  => (
  <div className='tools'>
    <Slider id='brightness' getHandler={getHandler} value={brightness}/>
    <Slider id='contrast' getHandler={getHandler} value={contrast}/>
    <Slider id='saturation' getHandler={getHandler} value={saturation}/>
    <button id='t-reset' className='btn waves-effect waves-light red' onClick={reset}>
      RESET
    </button>
  </div>
)

ImageTools.propTypes = {
  getHandler: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  brightness: PropTypes.number.isRequired,
  contrast: PropTypes.number.isRequired,
  saturation: PropTypes.number.isRequired,
}

export default ImageTools
