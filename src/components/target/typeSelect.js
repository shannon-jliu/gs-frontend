import React from 'react'
import PropTypes from 'prop-types'

import Selector from './selector'

const types = {
  alphanum: 'Alphanumeric',
  emergent: 'Emergent'
}

const TypeSelect = ({ className, onChange, value, title }) => (
  <Selector
    value={value}
    onChange={onChange}
    className={className}
    title={title}
    options={types}
  />
)

TypeSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default TypeSelect
