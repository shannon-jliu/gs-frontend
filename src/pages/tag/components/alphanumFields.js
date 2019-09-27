import React from 'react'
import PropTypes from 'prop-types'

import {ShapeSelect, ColorSelect, ConfSelect} from '../../../components/target'

const AlphanumFields = ({ shape, shapeColor, alpha, alphaColor, confidence, cameraTilt, isOffAxis, getHandler }) => (
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
    <div className='row'>
      <div className={'obj col s6 switch-outer ' + (cameraTilt ? '' : 'hidden')}>
        {/*Determines whether target is off-axis*/}
        <div className='switch'>
          <label>
            Off-Axis
            <input onChange={getHandler('offaxis')} type='checkbox' checked={isOffAxis}/>
            <span className='lever'></span>
          </label>
        </div>
      </div>
      <ConfSelect
        className={'obj col s' + (cameraTilt ? '6' : '12')}
        onChange={getHandler('mdlcClassConf')}
        title='Confidence'
        value={confidence}
      />
    </div>
  </div>
)

AlphanumFields.propTypes = {
  shape: PropTypes.string.isRequired,
  shapeColor: PropTypes.string.isRequired,
  alpha: PropTypes.string.isRequired,
  alphaColor: PropTypes.string.isRequired,
  confidence: PropTypes.string.isRequired,
  cameraTilt: PropTypes.bool.isRequired,
  isOffAxis: PropTypes.bool,
  getHandler: PropTypes.func.isRequired,
}

export default AlphanumFields
