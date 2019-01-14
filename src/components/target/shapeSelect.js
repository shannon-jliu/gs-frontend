import React from 'react'
import PropTypes from 'prop-types'

import Selector from './selector'

const shapes = {
  circle: 'Circle',
  cross: 'Cross',
  heptagon: 'Heptagon',
  hexagon: 'Hexagon',
  octagon: 'Octagon',
  pentagon: 'Pentagon',
  quarter_circle: 'Quarter Circle',
  rectangle: 'Rectangle',
  semicircle: 'Semicircle',
  square: 'Square',
  star: 'Star',
  trapezoid: 'Trapezoid',
  triangle: 'Triangle'
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
