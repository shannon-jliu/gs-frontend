import { fromJS } from 'immutable'
import _ from 'lodash'

// import * as action from '../actions/_ActionCreator.js'
import { PlaneSystemRequests } from '../util/sendApi.js'
import { PlaneSystemGetRequests as GetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const ProgressOperations = {
  savePSMode: (psMode, inactive, active) => {
    console.log(psMode)
    const success = data => {
      console.log(data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }

    let val = 'time-search'
    if (psMode == 1) {
      val = 'pan-search'
    }
    else if (psMode == 2) {
      val = 'manual-search'
    }
    else if (psMode == 3) {
      val = 'distance-search'
    }

    if (val != 'time-search') {
      PlaneSystemRequests.savePlaneSystemMode(val, success, failure)
      console.log('after ps mode post request')
    }
    else {
      PlaneSystemRequests.startTimeSearch(inactive, active, success, failure)
      console.log('after time search post request')
    }
  },
  saveGimbalPosition: (roll, pitch) => {
    const success = data => {
      console.log(data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }
    PlaneSystemRequests.saveGimbalPosition(roll, pitch, success, failure)
    console.log('after the maybe save gimbal position post request')
  },
  saveFocalLength: (fLFloat) => {
    // saveFocalLength: (dispatch, focalLength) => {
    const success = data => {
      console.log('success: ' + data)
      // dispatch(action.updateAssignment(fromJS(data)))
      // AssignmentOperations.getNextAssignment(dispatch)(currAssignment)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
      // dispatch(action.finishLoading())
    }
    PlaneSystemRequests.saveFocalLength(fLFloat, success, failure)
    console.log('after post request')
  },
  saveZoomLevel: (zoomLevel) => {
    const success = data => {
      console.log('success: ' + data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }
    PlaneSystemRequests.saveZoomLevel(zoomLevel, success, failure)
    console.log('after post request')
  },
  saveAperture: (aperture) => {
    const success = data => {
      console.log('success: ' + data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }
    PlaneSystemRequests.saveAperture(aperture, success, failure)
    console.log('after post request')
  },
  saveShutterSpeed: (numerator, denominator) => {
    const success = data => {
      console.log('success: ' + data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }
    PlaneSystemRequests.saveShutterSpeed(numerator, denominator, success, failure)
    console.log('after post request')
  },
  saveCapture: () => {
    const success = data => {
      console.log('success: ' + data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }
    PlaneSystemRequests.captureImage(success, failure)
    console.log('after post request')
  }
}

export default ProgressOperations
