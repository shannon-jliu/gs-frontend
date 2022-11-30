import React from 'react'
import PropTypes from 'prop-types'

import Selector from './selector'

const colors = {
  black: 'Black',
  blue: 'Blue',
  brown: 'Brown',
  gray: 'Gray',
  green: 'Green',
  orange: 'Orange',
  purple: 'Purple',
  red: 'Red',
  white: 'White',
  yellow: 'Yellow'
}

const ColorSelect = ({ className, onChange, value, title }) => (
  <Selector
    value={value}
    onChange={onChange}
    className={className}
    title={title}
    options={colors}
  />
)

ColorSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default ColorSelect
