import { fromJS } from 'immutable'
import _ from 'lodash'
import * as action from '../actions/airdropActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const AirdropOperations = {
  getSetting: dispatch => {
    const successCallback = data => dispatch(action.receiveSettings(data))
    
    SettingsGetRequests.getAirdropSetting(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateSettingsStart(setting))

      const successCallback = data => {
        SnackbarUtil.render('Successfully updated airdrop setting')
        dispatch(action.updateSettingsSuccessFinish(data))
      }
  
      const failureCallback = () => {
        SnackbarUtil.render('Failed to update airdrop setting')
        dispatch(action.updateSettingsFailedFinish(setting))
      }
  
      SettingsRequest.updateAirdropSetting(setting, successCallback, failureCallback)
    }
  )
}

export default AirdropOperations
