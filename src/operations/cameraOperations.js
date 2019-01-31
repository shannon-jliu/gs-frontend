import { fromJS } from 'immutable'
import _ from 'lodash'
import * as action from '../actions/cameraActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const CameraOperations = {
  getCapturing: dispatch => {
    // TODO: Not sending a full setting. Only sending capturing property
    const successCallback = data => dispatch(action.receiveCameraSettings(data))

    SettingsGetRequests.getCameraSettingCapturing(successCallback, () => {})
  },

  getZoom: dispatch => {
    // TODO: Not sending a full setting. Only sending zoom property
    const successCallback = data => dispatch(action.receiveCameraSettings(data))

    SettingsGetRequests.getCameraSettingZoom(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateCameraSettingsStart(setting))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated camera setting')
        dispatch(action.receiveAndUpdateCameraSettings(data))
      }
  
      const failureCallback = () => {
        SnackbarUtil.render('Failed to update camera setting')
        dispatch(action.updateCameraSettingsFailed(setting))
      }
  
      SettingsRequest.updateCameraSetting(setting, successCallback, failureCallback)
    }
  )
}

export default CameraOperations
