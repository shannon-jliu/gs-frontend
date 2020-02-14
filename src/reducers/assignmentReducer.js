import {fromJS} from 'immutable'

/**
 * Notes on state representation:
 * - assignments - (list) of assignments (objects). See API for example of an assignment object
 *   - image obj (imageUrl, image id, etc.)
 * - current - (int) the current index in assignments
 * - loading - (bool) indicates whether or not an assignment from the server is added
*/
const initialState = fromJS({
  assignments: [],
  current: -1,
  loading: false
})

const assignmentReducer = (state = initialState, action) => {
  // return initialState
  switch (action.type) {
  case 'GET_NEW_ASSIGNMENT_SUCCESS':
    return receiveNewAssignment(state, action.assignment)
  case 'GET_NEW_ASSIGNMENT_STARTED':
    return startLoading(state)
  case 'GET_NEW_ASSIGNMENT_FAILED':
    return finishLoading(state)
  case 'SET_ACTIVE_ASSIGNMENT':
    return setActive(state, action.index)
  case 'UPDATE_ASSIGNMENT':
    return updateAssignment(state, action.assignment)
  default:
    return state
  }
}

function receiveNewAssignment(state, assignment) {
  return state
    .update('assignments', assignments => assignments.push(assignment))
    .set('loading', false)
}

function startLoading(state) {
  return state.set('loading', true)
}

function finishLoading(state) {
  return state.set('loading', false)
}

function setActive(state, index) {
  if (index >= 0 && index < state.get('assignments').size) {
    return state.merge({'current': index, 'loading': false})
  } else {
    return state
  }
}

function updateAssignment(state, updatedAssign) {
  return state.update('assignments', assignments =>
    assignments.map(localAssignment => {
      if (localAssignment.get('id') === updatedAssign.get('id')) {
        return updatedAssign
      } else {
        return localAssignment
      }
    })
  )
}

export default assignmentReducer
