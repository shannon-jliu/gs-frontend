import { fromJS } from 'immutable'
import * as action from '../actions/cameraActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const CameraOperations = {
  getCapturing: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveCameraSettings(fromJS(data)))
    }

    SettingsGetRequests.getCameraSettingCapturing(successCallback, () => {})
  },

  getZoom: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveCameraSettings(fromJS(data)))
    }

    SettingsGetRequests.getCameraSettingZoom(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateCameraSettingsStart(fromJS(setting)))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated camera setting')
        dispatch(action.receiveAndUpdateCameraSettings(fromJS(data)))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update camera setting')
        dispatch(action.updateCameraSettingsFailed(fromJS(setting)))
      }

      SettingsRequest.updateCameraSetting(setting, successCallback, failureCallback)
    }
  )
}

export default CameraOperations
