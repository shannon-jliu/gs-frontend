import { fromJS } from 'immutable'
import _, { update } from 'lodash'

const initialState = fromJS({
  local: [],
  saved: [],
})

const psModeReducer = (state = initialState, action) => {
  // switch (action.type) {
  //   case 'UPDATE_PSMODE':
  //     return updatePSMode(state, action.mode)
  //   default:
  //     return state
  // }
}
// function updatePSMode(state, mode) {
//   return state.update('local', (l) => l.push(mode))
// }

export default psModeReducer