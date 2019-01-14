import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const Selector = ({ value, onChange, className, title, options }) => {
  const opts = _.map(_.keys(options), k => (
    <option key={k} value={k}>
      {options[k]}
    </option>
  ))
  className = _.isUndefined(className) ? '' : className + ' '
  return (
    <div className={className + 'input-field'}>
      <select onChange={onChange} defaultValue={value}>
        {opts}
      </select>
      <label>{title}</label>
    </div>
  )
}

Selector.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
}

export default Selector
