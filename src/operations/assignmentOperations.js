import { fromJS } from 'immutable'
import _ from 'lodash'
import localforage from 'localforage'

import * as action from '../actions/assignmentActionCreator.js'
import * as imageAction from '../actions/imageActionCreator.js'
import * as tAction from '../actions/targetActionCreator.js'
import * as tsAction from '../actions/targetSightingActionCreator.js'

import { AssignmentRequests } from '../util/sendApi.js'
import { AssignmentGetRequests } from '../util/receiveApi.js'
import { UtilRequests } from '../util/sendApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

// 'currAssignment' will always denotes an Immutable object, structured after Tag props
// 'assignment' denotes the inside assignment object within currAssignment
const AssignmentOperations = {
  getAllAssignments: dispatch => (
    currIndex => {
      const success = data => AssignmentOperations.processAssignments(dispatch)(data, currIndex, true)
      const failure = () => SnackbarUtil.render('Failed to retrieve assignments')
      AssignmentGetRequests.getAllAssignments(success, failure)
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
        AssignmentGetRequests.getAllAssignments(
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
        AssignmentRequests.requestWork((data, _, xhr) => {
          // if 204 is returned, no new assignments, do not increment
          if (xhr.status === 204) {
            dispatch(action.finishLoading())
            SnackbarUtil.render('No new assignments')
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
    index => {
      const successCallback = data => {
        for (let i = 0; i < data.length; i++) {
          dispatch(imageAction.receiveImage(fromJS(data[i])))
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

  // clears all mdlc-related states on the frontend
  clearMdlc: dispatch => {
    UtilRequests.clearMdlc(() => {
      dispatch(action.clearState())
      dispatch(imageAction.clearState())
      dispatch(tAction.clearState())
      dispatch(tsAction.clearState())
      localforage.clear().then(function() {
        SnackbarUtil.render('Database is now empty')
      }).catch(function(err) {
        SnackbarUtil.render(err)
      })
    }, () => {})
  }
}

export default AssignmentOperations
