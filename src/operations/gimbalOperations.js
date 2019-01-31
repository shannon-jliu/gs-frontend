import { fromJS } from 'immutable'
import _ from 'lodash'
import * as action from '../actions/gimbalActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const GimbalOperations = {
  getSetting: dispatch => {
    const successCallback = data => dispatch(action.receiveSettings(data))
    
    SettingsGetRequests.getGimbalSetting(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateSettingsStart(setting))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated gimbal setting')
        dispatch(action.receiveAndUpdateSettings(data))
      }
  
      const failureCallback = () => {
        SnackbarUtil.render('Failed to update gimbal setting')
        dispatch(action.updateSettingsFailed(setting))
      }
  
      SettingsRequest.updateGimbalSetting(setting, successCallback, failureCallback)
    }
  )
}

export default GimbalOperations
