import {fromJS, Map} from 'immutable'

/**
 * Notes on state representation:
 * - settings - (object) the current gimbal settings from the server. See API for reference.
 *   - contains a timestamp of the latest gimbal settings, -1 if none
 * - pending - (object) object in 'queue' to send to the ground server. If success, this will reset to {}.
*/
const initialState = fromJS({
  settings: fromJS({
    timestamp: -1
  }),
  pending: {}
})

const cameraGimbalReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_CAMERA_GIMBAL_SETTINGS_SUCCESS':
    // want to set pending to empty AND update gimbal settings
    state = state.set('pending', Map())
    return receiveCameraGimbalSettings(state, action)
  case 'RECEIVE_CAMERA_GIMBAL_SETTINGS':
    return receiveCameraGimbalSettings(state, action)
  case 'UPDATE_CAMERA_GIMBAL_SETTINGS_STARTED':
    return state.set('pending', action.settings)
  case 'UPDATE_CAMERA_GIMBAL_SETTINGS_FAILED':
    return state.set('pending', Map())
  default:
    return state
  }
}

function receiveCameraGimbalSettings(state, action) {
  const settings = action.settings
  if (state.getIn(['settings', 'timestamp']) < settings.get('timestamp')) {
    return state.set('settings', settings)
  } else {
    return state
  }
}

export default cameraGimbalReducer
