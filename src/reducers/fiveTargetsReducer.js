import {fromJS, Map} from 'immutable'

const initialState = fromJS({
    settings: fromJS({
      timestamp: -1,
      FirstTarget: {
        shape: '',
        shapeColor: '',
        letter: '',
        letterColor: ''
    },
    SecondTarget: {
        shape: 0,
        shapeColor: 0,
        letter: 0,
        letterColor: 0
    },
    ThirdTarget: {
        shape: 0,
        shapeColor: 0,
        letter: 0,
        letterColor: 0
    },
    FourthTarget: {
        shape: 0,
        shapeColor: 0,
        letter: 0,
        letterColor: 0
    },
    FifthTarget: {
        shape: 0,
        shapeColor: 0,
        letter: 0,
        letterColor: 0
    }
    }),
    pending: {}
  })

  const fiveTargetsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_FIVE_TARGETS_SETTINGS_SUCCESS':
        state = state.set('pending', Map())
        return receiveFiveTargetsSettings(state, action)
      case 'RECEIVE_FIVE_TARGETS_SETTINGS':
        return receiveFiveTargetsSettings(state,action)
      case 'UPDATE_FIVE_TARGETS_SETTINGS_STARTED':
        return state.set('pending', action.settings)
      case 'UPDATE FIVE_TARGETS_SETTINGS_FAILED':
        return state.set('pending',Map())
      default:
        return state
    }
  }

  function receiveFiveTargetsSettings(state,action) {
    const settings = action.settings
    if (state.getIn(['settings', 'timestamp']) < settings.get('timestamp')) {
      return state.set('settings',settings)
    }
    else {
      return state
    }
  }

  export default fiveTargetsReducer