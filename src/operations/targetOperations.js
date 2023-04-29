import { fromJS } from 'immutable'
import _ from 'lodash'

import * as action from '../actions/targetActionCreator.js'
import * as tsAction from '../actions/targetSightingActionCreator.js'
import { targetRequests } from '../util/sendApi.js'
import { TargetGetRequests as GetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'
import TargetSightingOperations from './targetSightingOperations.js'

const TargetOperations = {
  getAllTargets: (dispatch) => () => {
    const emergentSuccess = (alphanumTgts) => (data) => {
      const emergentTgts = _.map(data, (tgt) => {
        tgt.type = 'emergent'
        return tgt
      })
      const allTgts = fromJS(_.concat(alphanumTgts, emergentTgts))
      dispatch(action.addTargetsFromServer(allTgts))
    }

    const alphanumSuccess = (data) => {
      const alphanumTgts = _.map(data, (tgt) => {
        tgt.type = 'alphanum'
        return tgt
      })
      GetRequests.getEmergentTargets(
        emergentSuccess(alphanumTgts),
        emergentFail
      )
    }

    const alphanumFail = () =>
      SnackbarUtil.render('Failed to get alphanumeric targets')
    const emergentFail = () =>
      SnackbarUtil.render('Failed to get emergent targets')

    GetRequests.getAlphanumTargets(alphanumSuccess, alphanumFail)
  },

  addTarget: (dispatch) => (target) => {
    dispatch(action.addTarget(target))
  },

  deleteUnsavedTarget: (dispatch) => (target) => {
    dispatch(action.deleteTarget(target))
  },

  deleteSavedTarget: (dispatch) => (target) => {
    dispatch(action.deleteTarget(target))
    const failureCallback = () => {
      SnackbarUtil.render('Failed to delete target')
      TargetOperations.addTarget(dispatch)(target)
    }

    const successCallback = () => {
      //doesn't need to make more calls because backend should auto-detach targets
      dispatch(tsAction.deleteTargetFromTargetSightings(target))
    }

    targetRequests.deleteTarget(
      target.get('id'),
      successCallback,
      failureCallback
    )
  },

  //deletes all targets from database
  deleteAllTargets: (dispatch) => () => {
    const successCallback = () => {
      // SnackbarUtil.render('Deleted targets')
    }
    const failureCallback = () => {
      // SnackbarUtil.render('Failed to delete targets')
    }

    targetRequests.deleteAllTargets(successCallback, failureCallback)
  },

  //call in settings page
  saveTarget:
    (dispatch) =>
      //sightings can be either all sightings or only sightings bound to target, either works
      (target, sightings) => {
        dispatch(action.startSaveTarget(target.get('localId')))

        const targetToSend = _.omit(target.toJS(), [
          'localId',
          'offaxis',
          'type',
        ])

        const successCallback = (data) => {
          // SnackbarUtil.render('Successfully saved target')
          SnackbarUtil.render('Successfully saved targets')
          const recievedTarget = fromJS(data).set('type', 'alphanum')
          dispatch(
            action.succeedSaveTarget(recievedTarget, target.get('localId'))
          )

          sightings
            .filter((ts) => ts.get('localTargetId') === target.get('localId'))
            .forEach((ts) => {
              TargetSightingOperations.updateTargetSighting(dispatch)(
                ts,
                fromJS({ target: recievedTarget })
              )
            })
        }

        const failureCallback = () => {
          SnackbarUtil.render('Failed to save targets')
          // SnackbarUtil.render('Failed to save target')
          dispatch(action.failSaveTarget(target.get('localId')))
        }

        targetRequests.saveTarget(targetToSend, successCallback, failureCallback)
      },

  updateTarget: (dispatch) => (target, attribute) => {
    dispatch(action.startUpdateTarget(target, attribute))

    const targetToSend = _.pick(target.merge(attribute).toJS(), [
      'shape',
      'shapeColor',
      'alpha',
      'alphaColor',
      'description',
      'geotag',
      'thumbnailTsid',
    ])

    const successCallback = (data) => {
      SnackbarUtil.render('Successfully updated target')
      const recievedTarget = fromJS(data).set('type', target.get('type'))
      dispatch(action.succeedUpdateTarget(recievedTarget, attribute))
    }

    const failureCallback = () => {
      SnackbarUtil.render('Failed to update target')
      dispatch(action.failUpdateTarget(target, attribute))
    }

    targetRequests.updateTarget(
      target.get('type') === 'alphanum',
      target.get('id'),
      targetToSend,
      successCallback,
      failureCallback
    )
  },

  sendTarget: (dispatch) => (target) => {
    const successCallback = () => {
      SnackbarUtil.render('Sent target to autopilot')
    }
    const failureCallback = () => {
      SnackbarUtil.render('Failed to send target to autopilot')
    }
    targetRequests.sendTarget(target, successCallback, failureCallback)
  }
}

export default TargetOperations
