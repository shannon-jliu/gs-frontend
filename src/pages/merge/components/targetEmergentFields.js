import React from 'react'
import PropTypes from 'prop-types'

const TargetEmergentFields = ({ description, getHandler }) => (
  <div className='row'>
    {/*Description textfield */}
    <div className='obj input-field col s12'>
      <input
        onChange={getHandler('description')}
        type='text'
        value={description}
      />
      <label htmlFor='description'>Description</label>
    </div>
  </div>
)

TargetEmergentFields.propTypes = {
  description: PropTypes.string.isRequired,
  getHandler: PropTypes.func.isRequired,
}

export default TargetEmergentFields
