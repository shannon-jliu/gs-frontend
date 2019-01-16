import React from 'react'
import PropTypes from 'prop-types'

import Selector from './selector'

const confs = {
  high: 'High',
  medium: 'Medium',
  low: 'Low'
}

const ConfSelect = ({ value, onChange, className, title }) => (
  <Selector
    value={value}
    onChange={onChange}
    className={className}
    title={title}
    options={confs}
  />
)

ConfSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default ConfSelect
