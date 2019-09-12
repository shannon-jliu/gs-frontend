import { fromJS } from 'immutable'
import _ from 'lodash'
import * as action from '../actions/fireworksActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const FireworksOperations = {
  getColor: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveSettings(fromJS(data)))
    }

    SettingsGetRequests.getFireworksSettingColor(successCallback, () => {})
  },

  getNumber: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveSettings(fromJS(data)))
    }

    SettingsGetRequests.getFireworksSettingNumber(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateSettingsStart(fromJS(setting)))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated fireworks setting')
        dispatch(action.receiveAndUpdateSettings(fromJS(data)))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update fireworks setting')
        dispatch(action.updateSettingsFailed(fromJS(setting)))
      }

      SettingsRequest.updateFireworksSetting(setting, successCallback, failureCallback)
    }
  )
}

export default FireworksOperations
