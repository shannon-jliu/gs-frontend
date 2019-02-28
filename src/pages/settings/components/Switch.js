import React from 'react'
import PropTypes from 'prop-types'

const Switch = ({offState, myRef, onChange, id, checked, onState}) => {
  return (
    <span>
      <div className="switch">
        <label
          htmlFor={id}
        >
          {offState}
          <input 
            ref={myRef}
            onChange={onChange}
            type="checkbox"
            id={id}
            checked={checked}
          />
          <span className="lever"></span>
          {onState}
        </label>
      </div>
    </span>
  )
}

Switch.propTypes = {
  offState: PropTypes.string.isRequired,
  myRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onState: PropTypes.string.isRequired
}

export default Switch
