import {fromJS, Map} from 'immutable'

/*
 * Notes on state representation:
 * - settings - (object) the current airdrop settings from the server. See API for reference.
 *   - contains a timestamp of the latest fireworks settings, -1 if none
 * - pending - (object) object in 'queue' to send to the ground server. If success, this will reset to {}.
*/

const initialState = fromJS({
  settings: {
    timestamp: -1
  },
  pending: {}
})

const fireworksReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_FIREWORKS_SETTINGS_SUCCESS':
    // want to set pending to empty AND update fireworks settings
    state = state.set('pending', Map())
    var settings = action.settings
    if (state.getIn(['settings', 'timestamp']) < settings.get('timestamp')) {
      return state.set('settings', settings)
    } else {
      return state
    }
  case 'RECEIVE_FIREWORKS_SETTINGS':
    settings = action.settings
    if (state.getIn(['settings', 'timestamp']) < settings.get('timestamp')) {
      return state.set('settings', settings)
    } else {
      return state
    }
  case 'UPDATE_FIREWORKS_SETTINGS_STARTED':
    return state.set('pending', action.settings)
  case 'UPDATE_FIREWORKS_SETTINGS_FAILED':
    return state.set('pending', Map())
  default:
    return state
  }
}

export default fireworksReducer
