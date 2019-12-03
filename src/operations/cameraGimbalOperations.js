import { fromJS } from 'immutable'
import * as action from '../actions/cameraGimbalActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const CameraGimbalOperations = {
  getSetting: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveSettings(fromJS(data)))
    }

    SettingsGetRequests.getCameraGimbalSetting(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateSettingsStart(fromJS(setting)))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated gimbal setting')
        dispatch(action.receiveAndUpdateSettings(fromJS(data)))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update gimbal setting')
        dispatch(action.updateSettingsFailed(fromJS(setting)))
      }

      SettingsRequest.updateCameraGimbalSetting(setting, successCallback, failureCallback)
    }
  )
}

export default CameraGimbalOperations
