import { fromJS } from 'immutable'
import _ from 'lodash'

import * as action from '../actions/assignmentActionCreator.js'
import * as imageAction from '../actions/imageActionCreator.js'

import { AssignmentRequests } from '../util/sendApi.js'
import { AssignmentGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

// 'currAssignment' will always denotes an Immutable object
const AssignmentOperations = {
  getAllAssignments: dispatch => (
    currIndex => {
      const success = data => AssignmentOperations.processAssignments(dispatch)(data, currIndex, true)
      const failure = () => SnackbarUtil.render('Failed to retrieve assignments')
      AssignmentGetRequests.getAllAssignments(success, failure)
    }
  ),

  // will return false if failed to update, true if it succeeded or was already done
  finishAssignment: dispatch => (
    async currAssignment => {
      const success = data => {
        dispatch(action.updateAssignment(fromJS(data)))
        return true
      }
      const failure = () => {
        SnackbarUtil.render('Failed to complete assignment')
        return false
      }
      if (currAssignment && currAssignment.has('id') && !currAssignment.get('done'))
        return AssignmentRequests.updateAssignment(currAssignment.toJS(), success, failure)
      else if (currAssignment.get('done')) return true // if the assignment was already completed
      else failure()
    }
  ),

  getNextAssignment: dispatch => (
    currAssignment => {
      AssignmentOperations.finishAssignment(dispatch)(currAssignment.get('assignment')).then(result => {
        // only grab next assignment upon successfully completing the current one
        if (result) {
          if (currAssignment.get('currentIndex') < currAssignment.get('total') - 1) {
            dispatch(action.setActive(currAssignment.get('currentIndex') + 1))
          } else if (!currAssignment.get('loading')) {
            dispatch(action.startLoading)
            const failure = () => dispatch(action.finishLoading)
            AssignmentGetRequests.getAllAssignmentsAfter(
              currAssignment.get('currentIndex') + 1,
              AssignmentOperations.nextAssignmentSuccess(dispatch)(currAssignment),
              failure
            )
          }
        }
      })
    }
  ),

  // method factored out for nicer tests, should only be used as a
  // success callback of AssignmentGetRequests.getNextAssignment
  nextAssignmentSuccess: dispatch => (
    currAssignment => (
      // adds assignments, a JS array from API output, into the store
      assignments => {
        AssignmentOperations.processAssignments(dispatch)(assignments, currAssignment.get('currentIndex'), false)
        const msg = assignments.length > 0 ? '. ' + assignments.length + ' assignments were found' : ''
        AssignmentRequests.requestWork((data, _, xhr) => {
          // if 204 is returned, no new assignments, do not increment
          if (xhr.status == 204) {
            dispatch(action.finishLoading)
            SnackbarUtil.render('No new assignments' + msg)
          } else {
            dispatch(action.receiveNewAssignment(fromJS(data)))
            dispatch(imageAction.receiveImage(fromJS(data.image)))
            dispatch(action.setActive(currAssignment.get('currentIndex') + 1))
          }
        }, () => {})
      }
    )
  ),

  getPrevAssignment: dispatch => (
    currAssignment => {
      const currIndex = currAssignment.get('currentIndex')
      if (currIndex > 0) dispatch(action.setActive(currIndex - 1))
    }
  ),

  // adds assignments, a JS array from API output, into the store
  // currAssignment is Immutable
  // - if currAssignment is not defined, then it will bring the user back to
  //    where they left off (they just reloaded the page)
  // - if currAssignment is defined, then increment to the next assignment
  processAssignments: dispatch => (
    (assignments, currIndex, goToLast) => {
      if (assignments.length > 0) {
        _.forEach(assignments, assignment => {
          dispatch(action.receiveNewAssignment(fromJS(assignment)))
          dispatch(imageAction.receiveImage(fromJS(assignment.image)))
        })
        // set current assignment to latest index or if currAssignment is defined, the next one
        const ind = currIndex + (goToLast ? assignments.length : 1)
        dispatch(action.setActive(ind))
      }
    }
  )
}

export default AssignmentOperations
