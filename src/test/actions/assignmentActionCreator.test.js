import {fromJS} from 'immutable'
import {
  receiveNewAssignment,
  startLoading,
  finishLoading,
  setActive,
  updateAssignment
} from '../../actions/assignmentActionCreator.js'

it('should create an action when it receives an assignment', () => {
  // fields are omitted intentionally to avoid length
  const assignment = fromJS({
    'id': 21,
    'image': {
      'id': 1,
      'imageUrl': '/some/local/file/url.jpg',
      'timestamp': 23412313948574072,
    },
    'timestamp': 1443826874918,
    'assignee': 'MDLC',
    'done': false,
    'username': 'username'
  })
  const expectedAction = {
    type: 'GET_NEW_ASSIGNMENT_SUCCESS',
    assignment
  }
  expect(receiveNewAssignment(assignment)).toEqual(expectedAction)
})

it('should create an action when it a get assignment starts', () => {
  const expectedAction = {
    type: 'GET_NEW_ASSIGNMENT_STARTED'
  }
  expect(startLoading()).toEqual(expectedAction)
})

it('should create an action when it a get assignment fails', () => {
  const expectedAction = {
    type: 'GET_NEW_ASSIGNMENT_FAILED'
  }
  expect(finishLoading()).toEqual(expectedAction)
})

it('should create an action when it sets the active assignment', () => {
  const index = 1
  const expectedAction = {
    type: 'SET_ACTIVE_ASSIGNMENT',
    index
  }
  expect(setActive(1)).toEqual(expectedAction)
})
