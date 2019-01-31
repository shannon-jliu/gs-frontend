import {fromJS, Map} from 'immutable'

const initialState = fromJS({
  settings: {
    timestamp: -1
  },
  pending: {}
})

const cameraReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_CAMERA_SETTINGS_SUCCESS':
    // want to set pending to empty AND update camera settings
    state = state.set('pending', Map())
    var settings = action.settings
    if (state.getIn(['settings', 'timestamp']) < settings.get('timestamp')) {
      return state.set('settings', settings)
    } else {
      return state
    }
  case 'RECEIVE_CAMERA_SETTINGS':
    settings = action.settings
    if (state.getIn(['settings', 'timestamp']) < settings.get('timestamp')) {
      return state.set('settings', settings)
    } else {
      return state
    }
  case 'UPDATE_CAMERA_SETTINGS_STARTED':
    return state.set('pending', Map(action.settings))
  case 'UPDATE_CAMERA_SETTINGS_FAILED':
    return state.set('pending', Map())
  default:
    return state
  }
}

export default cameraReducer
