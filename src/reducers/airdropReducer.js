import {fromJS, Map} from 'immutable'

/**
 * Notes on state representation:
 * - settings - (object) the current airdrop settings from the server. See API for reference.
 *   - contains a timestamp of the latest airdrop settings, -1 if none
 * - pending - (object) object in 'queue' to send to the ground server. If success, this will reset to {}.
*/

const initialState = fromJS({
  settings: {
    timestamp: -1
  },
  pending: {}
})

const airdropReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'RECEIVE_AIRDROP_SETTINGS':
    return receiveSettings(state, action.settings)
  case 'UPDATE_AIRDROP_SETTINGS_SUCCESS':
    // want to set pending to empty AND update airdrop settings
    var newState = updateSettingsFinish(state, action.settings)
    return receiveSettings(newState, action.settings)
  case 'UPDATE_AIRDROP_SETTINGS_STARTED':
    return updateSettingsStart(state, action.settings)
  case 'UPDATE_AIRDROP_SETTINGS_FAILED':
    return updateSettingsFinish(state, action.settings)
  default:
    return state
  }
}

function receiveSettings(state, settings) {
  if (state.getIn(['settings', 'timestamp']) < settings.getIn(['timestamp'])) {
    return state.set('settings', settings)
  } else {
    return state
  }
}

function updateSettingsStart(state, settings) {
  return state.set('pending', settings)
}

function updateSettingsFinish(state, settings) {
  return state.set('pending', Map())
}

export default airdropReducer
