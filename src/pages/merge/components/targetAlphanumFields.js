import React from 'react'
import PropTypes from 'prop-types'

import {ShapeSelect, ColorSelect} from '../../../components/target'

const TargetAlphanumFields = ({ shape, shapeColor, alpha, alphaColor, getHandler }) => (
  <div>
    <div className='row'>
      {/* Select the shape */}
      <ShapeSelect
        className='obj col s6'
        onChange={getHandler('shape')}
        title='Shape'
        value={shape}
      />
      {/* Select the shape color*/}
      <ColorSelect
        className='obj col s6'
        onChange={getHandler('shapeColor')}
        title='Shape Color'
        value={shapeColor}
      />
    </div>
    <div className='row'>
      {/*Alphanumeric textfield. getHandler should limit this to one char */}
      <div className='obj input-field col s6'>
        <input
          onChange={getHandler('alpha')}
          type='text'
          value={alpha}
        />
        <label htmlFor='alpha' className={alpha ? 'active' : null}>Alpha</label>
      </div>
      {/* Select the alphanumeric color */}
      <ColorSelect
        className='obj col s6'
        onChange={getHandler('alphaColor')}
        title='Alpha Color'
        value={alphaColor}
      />
    </div>
  </div>
)

TargetAlphanumFields.propTypes = {
  shape: PropTypes.string.isRequired,
  shapeColor: PropTypes.string.isRequired,
  alpha: PropTypes.string.isRequired,
  alphaColor: PropTypes.string.isRequired,
  getHandler: PropTypes.func.isRequired,
}

export default TargetAlphanumFields
