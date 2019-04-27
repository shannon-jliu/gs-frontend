import React from 'react'
import PropTypes from 'prop-types'

import {ShapeSelect, ColorSelect} from '../../../components/target'

const AlphanumFields = ({ shape, shapeColor, alpha, alphaColor, cameraTilt, isOffAxis, getHandler }) => (
  <div>
    <div className='row'>
      {/* Select the shape */}
      <ShapeSelect
        className='obj col s6'
        onChange={getHandler('shape')}
        title='Shape'
        value={shape}
      />
      {/* Select the shape color, changing this.state.shapeColor */}
      <ColorSelect
        className='obj col s6'
        onChange={getHandler('shapeColor')}
        title='Shape Color'
        value={shapeColor}
      />
    </div>
    <div className='row'>
      {/*Alphanumeric textfield. TagSighting will limit this to one char */}
      <div className='obj input-field col s6'>
        <input
          onChange={getHandler('alpha')}
          type='text'
          value={alpha}
        />
        <label htmlFor='alpha'>Alpha</label>
      </div>
      {/* Select the alphanumeric color */}
      <ColorSelect
        className='obj col s6'
        onChange={getHandler('alphaColor')}
        title='Alpha Color'
        value={alphaColor}
      />
    </div>
    <div className={'obj switch ' + (cameraTilt ? 'row' : 'hidden')}>
      {/*Determines whether target is off-axis*/}
      <label>
        Off-Axis
        <input onChange={getHandler('offaxis')} type='checkbox' checked={isOffAxis}/>
        <span className='lever'></span>
      </label>
    </div>
  </div>
)

AlphanumFields.propTypes = {
  shape: PropTypes.string.isRequired,
  shapeColor: PropTypes.string.isRequired,
  alpha: PropTypes.string.isRequired,
  alphaColor: PropTypes.string.isRequired,
  cameraTilt: PropTypes.bool.isRequired,
  isOffAxis: PropTypes.bool,
  getHandler: PropTypes.func.isRequired,
}

export default AlphanumFields
