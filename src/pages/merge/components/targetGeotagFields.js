import React from 'react'
import PropTypes from 'prop-types'

const TargetGeotagFields = ({ latitude, longitude, getHandler }) => (
  <div className='row'>
    {/*Latitude. Restricted to be a number, bounds should be checked when saving */}
    <div className='obj input-field col s6'>
      <input
        onChange={getHandler('latitude')}
        type='number'
        value={latitude}
      />
      <label htmlFor="latitude" className={latitude ? 'active' : null}>Latitude (-90–90)</label>
    </div>
    {/*Longitude. Restricted to be a number, bounds should be checked when saving */}
    <div className='obj input-field col s6'>
      <input
        onChange={getHandler('longitude')}
        type='number'
        value={longitude}
      />
      <label htmlFor='longitude' className={longitude ? 'active' : null}>Longitude (-180–180)</label>
    </div>
  </div>
)

TargetGeotagFields.propTypes = {
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
  getHandler: PropTypes.func.isRequired,
}

export default TargetGeotagFields
