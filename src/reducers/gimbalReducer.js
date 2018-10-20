import {fromJS, Map} from 'immutable'

const initialState = fromJS({
  settings: {
    // empty initially but we still need a timestamp obj to compare against
    timestamp: -1
  },
  pending: {}
})

const gimbalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_GIMBAL_SETTINGS_SUCCESS':
      // want to set pending to empty AND update gimbal settings
      state = state.set('pending', Map());
      // no return here so it will update gimbal settings in the next case statement
    case 'RECEIVE_GIMBAL_SETTINGS':
      const settings = action.settings
      if (state.getIn(['settings', 'timestamp']) < settings.timestamp) {
        return state.set('settings', fromJS(settings));
      } else {
        return state;
      }
    case 'UPDATE_GIMBAL_SETTINGS_STARTED':
      return state.set('pending', fromJS(action.settings));
    case 'UPDATE_GIMBAL_SETTINGS_FAILED':
      return state.set('pending', Map());
    default:
      return state
  }
}

export default gimbalReducer
