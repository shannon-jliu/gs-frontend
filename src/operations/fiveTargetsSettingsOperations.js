import { fromJS } from 'immutable'
import * as action from '../actions/fiveTargetsActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const FiveTargetsSettingsOperations = {
  getSetting: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveSettings(fromJS(data)))
    }

    SettingsGetRequests.getFiveTargetsSettings(successCallback, () => { })
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateSettingsStart(fromJS(setting)))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated target setting')
        dispatch(action.receiveAndUpdateSettings(fromJS(data)))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update target setting')
        dispatch(action.updateSettingsFailed(fromJS(setting)))
      }

      SettingsRequest.updateFiveTargetsSetting(setting, successCallback, failureCallback)
    }),


  // update number of targets
  updateNumTargets: (dispatch) => (num) => {
    dispatch(action.updateNumTargets(num))
  }
}

export default FiveTargetsSettingsOperations
