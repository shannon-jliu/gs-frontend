import React from 'react'
import PropTypes from 'prop-types'

const Radio = ({id, onChange, myRef, value, checked}) => {
  return(
    <label
      htmlFor={id}
    >
      <input
        onChange={onChange}
        type="radio"
        id={id}
        ref={myRef}
        value={value}
        checked={checked}
      />
      <span>{value === 'gps' ? 'GPS':value.charAt(0).toUpperCase() + value.slice(1)}</span>
    </label>
  )
}

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  myRef: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired
}

export default Radio
