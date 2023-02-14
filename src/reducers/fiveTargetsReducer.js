import { fromJS, Map } from 'immutable'

/*
 * Notes on state representation:
 * - settings - (object) the current camera settings from the server. See API for reference.
 *   - contains a timestamp of the latest camera settings, -1 if none
 * - pending - (object) object in 'queue' to send to the ground server. If success, this will reset to {}.
 */

const initialState = fromJS({
  settings: fromJS({
    timestamp: -1,
    targets: [
      {
        shape: '',
        shapeColor: '',
        letter: '',
        letterColor: '',
      },
      {
        shape: '',
        shapeColor: '',
        letter: '',
        letterColor: '',
      },
      {
        shape: '',
        shapeColor: '',
        letter: '',
        letterColor: '',
      },
      {
        shape: '',
        shapeColor: '',
        letter: '',
        letterColor: '',
      },
      {
        shape: '',
        shapeColor: '',
        letter: '',
        letterColor: '',
      },
    ],
  }),
  pending: {},
})

const fiveTargetsReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_FIVE_TARGETS_SETTINGS_SUCCESS':
    state = state.set('pending', Map())
    return receiveFiveTargetsSettings(state, action)
  case 'RECEIVE_FIVE_TARGETS_SETTINGS':
    return receiveFiveTargetsSettings(state, action)
  case 'UPDATE_FIVE_TARGETS_SETTINGS_STARTED':
    return state.set('pending', action.settings)
  case 'UPDATE FIVE_TARGETS_SETTINGS_FAILED':
    return state.set('pending', Map())
  default:
    return state
  }
}

function receiveFiveTargetsSettings(state, action) {
  const settings = action.settings
  if (state.getIn(['settings', 'timestamp']) < settings.get('timestamp')) {
    return state.set('settings', settings)
  } else {
    return state
  }
}

export default fiveTargetsReducer
