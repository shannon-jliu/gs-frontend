import { fromJS } from 'immutable'
import _ from 'lodash'
import * as action from '../actions/gimbalActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const GimbalOperations = {
  getSetting: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveSettings(fromJS(data)))
    }

    SettingsGetRequests.getGimbalSetting(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
        console.log('OONF')
      dispatch(action.updateSettingsStart(fromJS(setting)))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated gimbal setting')
        dispatch(action.receiveAndUpdateSettings(fromJS(data)))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update gimbal setting')
        dispatch(action.updateSettingsFailed(fromJS(setting)))
      }

      SettingsRequest.updateGimbalSetting(setting, successCallback, failureCallback)
    }
  )
}

export default GimbalOperations
