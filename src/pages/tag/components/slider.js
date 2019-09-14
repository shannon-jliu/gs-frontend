import React from 'react'
import PropTypes from 'prop-types'

const Slider = ({ id, getHandler, value }) => (
  <span>
    <p className="label">{id.charAt(0).toUpperCase() + id.slice(1)}: </p>
    <div className='tool range-field'>
      <input
        id={'t-' + id}
        type='range'
        value={value}
        min='0'
        max='500'
        onChange={getHandler(id)}
      />
    </div>
  </span>
)

Slider.propTypes = {
  id: PropTypes.string.isRequired,
  getHandler: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default Slider
