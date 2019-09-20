import React from 'react'
import PropTypes from 'prop-types'

import {ConfSelect} from '../../../components/target'

const EmergentFields = ({ description, confidence, getHandler }) => (
  <div>
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
    <div className='row'>
      <ConfSelect
        className='obj col s12'
        onChange={getHandler('mdlcClassConf')}
        title='Confidence'
        value={confidence}
      />
    </div>
  </div>
)

EmergentFields.propTypes = {
  description: PropTypes.string.isRequired,
  confidence: PropTypes.string.isRequired,
  getHandler: PropTypes.func.isRequired,
}

export default EmergentFields
