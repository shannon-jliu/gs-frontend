import React from 'react'
import PropTypes from 'prop-types'

import Selector from './selector'

const shapes = {
  circle: 'Circle',
  semicircle: 'Semicircle',
  quarter_circle: 'Quarter Circle',
  triangle: 'Triangle',
  square: 'Square',
  rectangle: 'Rectangle',
  trapezoid: 'Trapezoid',
  pentagon: 'Pentagon',
  heptagon: 'Heptagon',
  hexagon: 'Hexagon',
  octagon: 'Octagon',
  star: 'Star',
  cross: 'Cross'
}

const ShapeSelect = ({ value, onChange, className, title }) => (
  <Selector
    value={value}
    onChange={onChange}
    className={className}
    title={title}
    options={shapes}
  />
)

ShapeSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default ShapeSelect
