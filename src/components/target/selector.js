import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const Selector = ({ value, onChange, className, title, options }) => {
  const opts = _.map(_.keys(options), k => (
    <option key={k} value={k}>
      {options[k]}
    </option>
  ))
  const fullClassName = (_.isUndefined(className) ? '' : className)
  const finalValue = _.isNil(value) ? '' : value
  return (
    <div className={fullClassName}>
      <select onChange={onChange} value={finalValue} className='browser-default'>
        <option key='' value='' disabled>{title}</option>
        {opts}
      </select>
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
