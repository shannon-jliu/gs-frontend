import { fromJS, Map } from 'immutable'

/*
 * Notes on state representation:
 * - usersEnabled - (boolean) represents whether users are enabled on the backend
*/

const initialState = fromJS({
  usersEnabled: true
})

const utilReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'RECEIVE_USERS_ENABLED':
    return updateUsersEnabled(state, action.usersEnabled)
  default:
    return state
  }
}

function updateUsersEnabled(state, usersEnabled) {
  return state.set('usersEnabled', usersEnabled)
}

export default utilReducer
