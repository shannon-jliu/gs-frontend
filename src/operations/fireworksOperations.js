import { fromJS } from 'immutable'
import _ from 'lodash'
import * as action from '../actions/fireworksActionCreator.js'
import { SettingsRequest } from '../util/sendApi.js'
import { SettingsGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const FireworksOperations = {
  getSetting: dispatch => {
    /* TODO: Finish this "success callback", a function that will be called when the SettingsGetRequest.getFireworksSetting
    function below is successfully called. (This just means that it ran to completion without any errors.) For reference,
    check out cameraGimbalOperations.js */
    const successCallback = data => {
      
    }

    // This requests the current Fireworks setting from the plane
    SettingsGetRequests.getFireworksSetting(successCallback, () => {})
  },

  updateSettingsStart: dispatch => (
    setting => {
      dispatch(action.updateSettingsStart(fromJS(setting)))

      /* TODO: Finish this "success callback" function. For reference check out cameraGimbalOperations.js */
      const successCallback = data => {

      }

      /* TODO: Finish this "failure callback", a function that will be called when the SettingsGetRequest.updateFireworksSetting
      function below is called unsuccessfully. (This just means that it did not run to completion because it caused an error
      somewhere.) For reference, check out cameraGimbalOperations.js */
      const failureCallback = () => {

      }

      // This starts the process of updating the Fireworks setting on the plane
      SettingsRequest.updateFireworksSetting(setting, successCallback, failureCallback)
    }
  )
}

export default FireworksOperations
