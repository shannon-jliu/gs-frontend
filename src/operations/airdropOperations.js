import { fromJS } from 'immutable'
import _ from 'lodash'
import * as action from '../actions/airdropActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const AirdropOperations = {
  getSetting: dispatch => {
    const successCallback = data => {
      dispatch(action.receiveSettings(fromJS(data)))
    }
    
    SettingsGetRequests.getAirdropSetting(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateSettingsStart(fromJS(setting)))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated airdrop setting')
        dispatch(action.updateSettingsSuccessFinish(fromJS(data)))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update airdrop setting')
        dispatch(action.updateSettingsFailedFinish(fromJS(setting)))
      }

      SettingsRequest.updateAirdropSetting(setting, successCallback, failureCallback)
    }
  )
}

export default AirdropOperations
