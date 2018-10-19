import {fromJS} from 'immutable'

const initialState = fromJS({
  assignments: [], //[{id: 1, image: {imageUrl: 'http://cdn.playbuzz.com/cdn/0079c830-3406-4c05-a5c1-bc43e8f01479/7dd84d70-768b-492b-88f7-a6c70f2db2e9.jpg'}}],
  current: -1,
  loading: false
})

const assignmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_NEW_ASSIGNMENT_SUCCESS':
      return receiveNewAssignment(state, action.assignment)
    case 'GET_NEW_ASSIGNMENT_STARTED':
      return startLoading(state)
    case 'GET_NEW_ASSIGNMENT_FAILED':
      return finishLoading(state)
    case 'SET_ACTIVE_ASSIGNMENT':
      return setActive(state, action.index)
    default:
      return state
  }
}

function receiveNewAssignment(state, assignment) {
  return state
      .update('assignments', l => l.push(fromJS(assignment)))
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
      return state.set('current', index)
    } else {
      return state
    }
}

export default assignmentReducer
