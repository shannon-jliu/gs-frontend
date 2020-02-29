import { fromJS } from 'immutable'
import _ from 'lodash'
import localforage from 'localforage'

import * as action from '../actions/assignmentActionCreator.js'
import * as imageAction from '../actions/imageActionCreator.js'

import { AssignmentRequests } from '../util/sendApi.js'
import { AssignmentGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

// 'currAssignment' will always denotes an Immutable object, structured after Tag props
// 'assignment' denotes the inside assignment object within currAssignment
const AssignmentOperations = {
  getAllAssignmentsAfter: dispatch => (
    currIndex => {
      const success = data => AssignmentOperations.processAssignments(dispatch)(data, currIndex, true)
      const failure = () => SnackbarUtil.render('Failed to retrieve assignments')
      AssignmentGetRequests.getAllAssignmentsAfter(currIndex, success, failure)
    }
  ),

  // will call getNextAssignment if updating was success or if it was already done
  finishAssignment: dispatch => (
    currAssignment => {
      dispatch(action.startLoading())
      const assignment = currAssignment.get('assignment') || null
      const success = data => {
        dispatch(action.updateAssignment(fromJS(data)))
        AssignmentOperations.getNextAssignment(dispatch)(currAssignment)
      }
      const failure = () => {
        SnackbarUtil.render('Failed to complete assignment')
        dispatch(action.finishLoading())
      }
      if (assignment && assignment.has('id') && !assignment.get('done')){
        AssignmentRequests.updateAssignment(assignment.toJS(), success, failure)
      }
      // if null initial assignment, the assignment was already completed, continue
      else if (!assignment || assignment.get('done')) AssignmentOperations.getNextAssignment(dispatch)(currAssignment)
      else failure()
    }
  ),

  // only called from finishAssignment if conditions met to get the next assignment
  getNextAssignment: dispatch => (
    currAssignment => {
      if (currAssignment.get('currentIndex') < currAssignment.get('total') - 1) {
        dispatch(action.setActive(currAssignment.get('currentIndex') + 1))
      } else if (!currAssignment.get('loading')) {
        const failure = () => dispatch(action.finishLoading())
        AssignmentGetRequests.getAllAssignmentsAfter(
          currAssignment.getIn(['assignment', 'id']) || 0,
          AssignmentOperations.nextAssignmentSuccess(dispatch)(currAssignment),
          failure
        )
      }
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
          if (xhr.status === 204) {
            dispatch(action.finishLoading())
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
  ),

  getNewImages: dispatch => (
    (index) => {
      const successCallback = data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i] !== null) dispatch(imageAction.receiveImage(fromJS(data[i])))
        }
      }

      AssignmentGetRequests.getNewImages(index, successCallback, () => {})
    }
  ),

  preloadImage: dispatch => (
    image => {
      dispatch(imageAction.preloadImage(fromJS(image)))
    }
  ),

  enableReceiving: dispatch => (
    enable => {
      AssignmentRequests.enableReceiving(() => {dispatch(action.enableReceiving(enable))}, () => {})
    }
  ),

  clearDb: dispatch => {
    AssignmentRequests.clearDb(() => {
      dispatch(action.clearState())
      dispatch(imageAction.clearState())
      localforage.clear().then(function() {
        // Run this code once the database has been entirely deleted.
        console.log('Database is now empty.')
      }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err)
      })
    }, () => {})
  }
}

export default AssignmentOperations
