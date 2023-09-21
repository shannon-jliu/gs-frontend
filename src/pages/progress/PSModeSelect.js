import React from 'react'
import PropTypes from 'prop-types'

import Selector from '../settings/components/selector.js'

const PSModes = {
  mode1: 'mode 1',
  mode2: 'mode 2',
  mode3: 'mode 3',
  mode4: 'mode 4',
  mode5: 'mode 5',
}


const PSModeSelect = ({ className, onChange, value, title }) => (
  <Selector
    value={value}
    onChange={onChange}
    className={className}
    title={title}
    options={PSModes}
  />
)


PSModeSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  title: PropTypes.string.isRequired
}


export default PSModeSelect