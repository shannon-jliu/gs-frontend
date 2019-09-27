import React from 'react'
import PropTypes from 'prop-types'

const EmergentFields = ({ description, getHandler }) => (
  <div className='row'>
    {/*Description textfield, changing this.state.description*/}
    <div className='obj input-field col s12'>
      <input
        onChange={getHandler('description')}
        type='text'
        value={description}
      />
      <label htmlFor='description'>
        Description
      </label>
    </div>
  </div>
)

EmergentFields.propTypes = {
  description: PropTypes.string.isRequired,
  getHandler: PropTypes.func.isRequired,
}

export default EmergentFields
