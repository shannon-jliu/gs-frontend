import 'jest-localstorage-mock'
import { fromJS } from 'immutable'

import * as action from '../../actions/assignmentActionCreator.js'
import * as imageAction from '../../actions/imageActionCreator.js'
import AssignmentOperations from '../../operations/assignmentOperations.js'
import { AssignmentRequests } from '../../util/sendApi.js'
import { AssignmentGetRequests } from '../../util/receiveApi.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('AssignmentOperations', () => {
  const assignment = fromJS({
    assignment: {
      id: 11,
      timestamp: 1443826874918,
      assignee: 'MDLC',
      image: 'image.png',
      loading: false,
      done: false
    },
    total: 1,
    currentIndex: 1,
  })

  const finishedAssignment = assignment.setIn(['assignment', 'done'], true)

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('processAssignments', () => {
    let assignments
    beforeEach(() => {
      const sndAssignment = assignment.set('image', 'image2.png').set('id', 20)
      const thirdAssignment = assignment.set('image', 'image3.png').set('id', 21)
      assignments = [assignment.toJS(), sndAssignment.toJS(), thirdAssignment.toJS()]
    })
    it('only processes assignments if there are assignments to process', () => {
      assignments = []
      AssignmentOperations.processAssignments(dispatch)(assignments, -1, true)

      expect(dispatch).toHaveBeenCalledTimes(0)
    })

    it('properly processes each assignment and sets index to the end', () => {
      AssignmentOperations.processAssignments(dispatch)(assignments, 0, true)
      expect(dispatch).toHaveBeenCalledTimes(7) // twice per assignment and once at the end
      expect(dispatch).toHaveBeenLastCalledWith(action.setActive(3))
    })

    it('correctly sets index to the next one', () => {
      AssignmentOperations.processAssignments(dispatch)(assignments, 1, false)
      expect(dispatch).toHaveBeenCalledTimes(7)
      expect(dispatch).toHaveBeenLastCalledWith(action.setActive(2))
    })
  })

  describe('getAllAssignments', () => {
    it('gets all assignments', () => {
      AssignmentOperations.processAssignments = jest.fn((dispatch) => (data, _) => 'processAssignments')
      AssignmentGetRequests.getAllAssignments = jest.fn((succ, fail) => succ(assignment))
      AssignmentOperations.getAllAssignments(dispatch)()

      expect(AssignmentOperations.processAssignments).toHaveBeenCalledTimes(1)
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('fails to get all assignments', () => {
      AssignmentGetRequests.getAllAssignments = jest.fn((succ, fail) => fail())
      AssignmentOperations.getAllAssignments(dispatch)()

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to retrieve assignments')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('nextAssignmentSuccess', () => {
    it('correctly prints no new assignments', () => {
      AssignmentRequests.requestWork = jest.fn((success, fail) => success(null, null, {status: 204}))
      let assignments = [1, 2, 3, 4, 5] // just giving it a length
      AssignmentOperations.nextAssignmentSuccess(dispatch)(assignment)(assignments)
      expect(AssignmentRequests.requestWork).toHaveBeenCalledTimes(1)
      expect(SnackbarUtil.render).toHaveBeenCalledWith('No new assignments. 5 assignments were found')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('correctly prints without finding any assignments', () => {
      AssignmentRequests.requestWork = jest.fn((success, fail) => success(null, null, {status: 204}))
      let assignments = []
      AssignmentOperations.nextAssignmentSuccess(dispatch)(assignment)(assignments)
      expect(AssignmentRequests.requestWork).toHaveBeenCalledTimes(1)
      expect(SnackbarUtil.render).toHaveBeenCalledWith('No new assignments')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('correctly grabs the next assignment with requestWork', () => {
      AssignmentRequests.requestWork = jest.fn((success, fail) =>
        success(assignment.toJS(), null, {status: 200})
      )
      let assignments = []
      AssignmentOperations.nextAssignmentSuccess(dispatch)(assignment)(assignments)
      expect(AssignmentRequests.requestWork).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledTimes(3)
      expect(dispatch).toHaveBeenNthCalledWith(1, action.receiveNewAssignment(assignment))
      expect(dispatch).toHaveBeenNthCalledWith(2, imageAction.receiveImage(assignment.get('image')))
      expect(dispatch).toHaveBeenNthCalledWith(3, action.setActive(2))
    })
  })

  describe('getNextAssignment', () => {
    beforeEach(() => {
      AssignmentGetRequests.getAllAssignmentsAfter = jest.fn((x, y, z) => (x, y, z))
    })

    it('it properly calls getAfter with the correct id', () => {
      AssignmentOperations.getNextAssignment(dispatch)(assignment)
      expect(AssignmentGetRequests.getAllAssignmentsAfter).toHaveBeenCalledTimes(1)
      expect(AssignmentGetRequests.getAllAssignmentsAfter).toHaveBeenCalledWith(
        11,
        expect.any(Function),
        expect.any(Function)
      )
      expect(dispatch).toHaveBeenCalledTimes(0)
    })

    it('grabs the next assignment if it is already in the local', () => {
      const multipleAssignments = assignment.set('total', 3)
      AssignmentOperations.getNextAssignment(dispatch)(multipleAssignments)
      expect(dispatch).toHaveBeenCalledWith(action.setActive(2))
      expect(dispatch).toHaveBeenCalledTimes(1)
    })

    it('does not grab the next assignment if it is loading', () => {
      const loadingAssignment = assignment.set('loading', true)
      AssignmentOperations.getNextAssignment(dispatch)(loadingAssignment)
      expect(dispatch).toHaveBeenCalledTimes(0)
    })
  })

  describe('finishAssignment', () => {
    it('successfully completes the assignment', () => {
      AssignmentOperations.getNextAssignment = jest.fn((dispatch) => (currAssignment) => currAssignment)
      AssignmentRequests.updateAssignment = jest.fn((_, success, __) => success(finishedAssignment.toJS()))

      AssignmentOperations.finishAssignment(dispatch)(assignment)

      expect(dispatch).toHaveBeenCalledWith(action.updateAssignment(finishedAssignment))
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(AssignmentOperations.getNextAssignment).toHaveBeenCalledTimes(1)
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('it will correctly fail to complete the assignment', () => {
      AssignmentRequests.updateAssignment = jest.fn((_, __, failure) => failure())
      AssignmentOperations.finishAssignment(dispatch)(assignment)

      expect(dispatch).toHaveBeenCalledTimes(2) // startLoading and finishLoading
      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to complete assignment')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('does not complete if the assignment is done', () => {
      AssignmentOperations.finishAssignment(dispatch)(finishedAssignment)
      expect(dispatch).toHaveBeenCalledTimes(1) // startLoading
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('getPrevAssignment', () => {
    it('successfully move to the previous assignment', () => {
      AssignmentOperations.getPrevAssignment(dispatch)(assignment)

      expect(dispatch).toHaveBeenCalledWith(action.setActive(0))
      expect(dispatch).toHaveBeenCalledTimes(1)
    })

    it('it will no op if there were no previous assignments', () => {
      const firstAssignment = assignment.set('currentIndex', 0)
      AssignmentOperations.getPrevAssignment(dispatch)(firstAssignment)

      expect(dispatch).toHaveBeenCalledTimes(0)
    })
  })
})
