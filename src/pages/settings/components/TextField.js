import React from 'react'
import PropTypes from 'prop-types'

const TextField = ({myRef, onChange, value, label}) => {
  return (
    <span>
      <input
        ref={myRef}
        type="text"
        onChange={onChange}
        value={value}
      />
      <label>{label}</label>
    </span>
  )
}

TextField.propTypes = {
  myRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  label: PropTypes.string.isRequired
}

export default TextField
