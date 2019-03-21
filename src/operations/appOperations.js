import { fromJS } from 'immutable'
import _ from 'lodash'
import * as cameraGimbalAction from '../actions/gimbalActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const AppOperations = {
  updateCameraGimbalSettingsLocal: dispatch => (
    setting => {
        // console.log(setting, fromJS(setting))
        console.log('updating')
        dispatch(cameraGimbalAction.receiveAndUpdateSettings(fromJS(setting)))
      // dispatch(cameraGimbalAction.updateSettingsStart(fromJS(setting)))
    }
  )
}

export default AppOperations
