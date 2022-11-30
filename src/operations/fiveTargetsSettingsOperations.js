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

    SettingsGetRequests.getFiveTargetsSettings(successCallback, () => {})
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
    } )
  // ),

  // saveFiveTarget: dispatch => (
  //   //sightings can be either all sightings or only sightings bound to target, either works
  //   (target, sightings) => {
  //     dispatch(action.startSaveTarget(target.get('localId')))

  //     const targetToSend = _.omit(target.toJS(), ['localId', 'offaxis', 'type'])

  //     const successCallback = (data) => {
  //       SnackbarUtil.render('Successfully saved target')
  //       const recievedTarget = fromJS(data).set('type', 'alphanum')
  //       dispatch(action.succeedSaveTarget(recievedTarget, target.get('localId')))

  //       sightings.filter(ts => ts.get('localTargetId') === target.get('localId')).forEach(ts => {
  //         TargetSightingOperations.updateTargetSighting(dispatch)(ts, fromJS({ target: recievedTarget }))
  //       })
  //     }

  //     const failureCallback = () => {
  //       SnackbarUtil.render('Failed to save target')
  //       dispatch(action.failSaveTarget(target.get('localId')))
  //     }

  //     targetRequests.saveTarget(targetToSend, successCallback, failureCallback)
  //   }
  // )
}

export default FiveTargetsSettingsOperations
