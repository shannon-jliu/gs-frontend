import { fromJS } from 'immutable'
import _ from 'lodash'

import * as action from '../actions/targetSightingActionCreator.js'
import { TargetSightingRequests } from '../util/sendApi.js'
import { TargetSightingGetRequests as GetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'
import { AUTH_TOKEN_ID } from '../constants/constants.js'

const TargetSightingOperations = {
  getAllSightings: dispatch => (
    () => {
      // the flow is essentially getAlphanum -> getEmergent -> combine -> dispatch

      const alphanumSuccess = data => {
        const alphanumSightings = _.map(data, sighting => {
          sighting.type = 'alphanum'
          return sighting
        })
        GetRequests.getEmergentSightings(emergentSuccess(alphanumSightings), emergentFail)
      }

      const emergentSuccess = alphanumSightings => (
        data => {
          const emergentSightings = _.map(data, sighting => {
            sighting.type = 'emergent'
            return sighting
          })
          const allSightings = fromJS(_.concat(alphanumSightings, emergentSightings))
          dispatch(action.addTargetSightingsFromServer(allSightings))
        }
      )

      const alphanumFail = () => SnackbarUtil.render('Failed to get alphanumeric target sightings')
      const emergentFail = () => SnackbarUtil.render('Failed to get emergent target sightings')

      GetRequests.getAlphanumSightings(alphanumSuccess, alphanumFail)
    }
  ),

  addTargetSighting: dispatch => (
    (sighting, assignment) => {
      dispatch(action.addTargetSighting(sighting, assignment))
    }
  ),

  deleteUnsavedTargetSighting: dispatch => (
    sighting => {
      dispatch(action.deleteTargetSighting(sighting))
    }
  ),

  deleteSavedTargetSighting: dispatch => (
    sighting => {
      dispatch(action.deleteTargetSighting(sighting))

      // Target is deleted but for some reason there's a failureCallback.
      const failureCallback = () => {
        SnackbarUtil.render('Deleted target sighting') // should actually say "Failed to delete target sighting"
        TargetSightingOperations.addTargetSighting(dispatch)(sighting, sighting.get('assignment'))
      }

      TargetSightingRequests.deleteTargetSighting(sighting.get('type') === 'alphanum', sighting.get('id'), () => ({}), failureCallback)
    }
  ),

  // TODO: issue here doesn't go to successCallback - find way to fix this... (doesn't call and doesn't filter..)

  saveTargetSighting: dispatch => (
    sighting => {
      dispatch(action.startSaveTargetSighting(sighting.get('localId')))

      const creator = {
        id: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).id,
        username: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).username,
        address: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).address,
        userType: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).userType
      }

      const sightingToSend = _.assign(
        _.omit(sighting.toJS(), ['localId', 'type']),
        { creator: creator })

      //TODO: not hitting this callback, which deletes the local sighting that contains "pending"
      const successCallback = data => {
        SnackbarUtil.render('Succesfully saved target sighting')
        const receivedSighting = fromJS(data).set('type', sighting.get('type'))
        dispatch(action.succeedSaveTargetSighting(receivedSighting, sighting.get('localId')))

        /*
        //if the target is emergent and has no description the description is updated to match that of the target sighting
        if (sighting.get('type') == "emergent" && receivedSighting.get('target').description == "") {
          const newEmergentTarget = receivedSighting.get('target').set('description', receivedSighting.get('description'))
          //TODO call future targetOperations to save the target (I feel like maybe this should be done on BE though, but leaving for now)
        } else if (sighting.get('type') == "alphanum" && sighting.get('offaxis') && data.get('target').shape === "") {
          //if the target is off-axis and contains empty fields, target fields are populated
          const newOffaxisTarget = data.get('target')
                .set('shape', sighting.get('shape'))
                .set('shapeColor', sighting.get('shapeColor'))
                .set('alpha', sighting.get('alphaColor'))
                .set('alphaColor', sighting.get('alphaColor'))
          //TODO call future targetOperations to save the target
        }
        */
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to save target sighting')
        dispatch(action.failSaveTargetSighting(sighting.get('localId')))
      }

      TargetSightingRequests.saveTargetSighting(sighting.get('type') === 'alphanum', sighting.getIn(['assignment', 'id']), sightingToSend, successCallback, failureCallback)
    }
  ),

  saveROISighting: dispatch => (
    sighting => {
      dispatch(action.startSaveTargetSighting(sighting.get('localId')))

      const creator = {
        id: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).id,
        username: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).username,
        address: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).address,
        userType: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).userType
      }

      const sightingToSend = _.assign(
        _.pick(sighting.toJS(), ['pixelx', 'pixely', 'assignment']),
        { creator: creator, averaged: false })

      const successCallback = data => {
        SnackbarUtil.render('Succesfully saved ROI sighting')

        // need to add back in height and width fields for ImageSighting component
        const sightingToSave = fromJS(data).merge({ type: 'roi', height: sighting.get('height'), width: sighting.get('width') })
        dispatch(action.succeedSaveTargetSighting(sightingToSave, sighting.get('localId')))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to save ROI sighting')
        dispatch(action.failSaveTargetSighting(sighting.get('localId')))
      }

      TargetSightingRequests.saveROISighting(sighting.getIn(['assignment', 'id']), sightingToSend, successCallback, failureCallback)
    }
  ),

  deleteSavedROISighting: dispatch => (
    sighting => {
      dispatch(action.deleteTargetSighting(sighting))
      const failureCallback = () => {
        SnackbarUtil.render('Failed to delete target sighting')
        TargetSightingOperations.addTargetSighting(dispatch)(sighting, sighting.get('assignment'))
      }

      TargetSightingRequests.deleteROISighting(sighting.get('id'), () => { }, failureCallback)
    }
  ),

  updateTargetSighting: dispatch => (
    (sighting, attribute) => {
      //in the future, this will send specific requests per attribute (but has to be implemented on BE first)
      dispatch(action.startUpdateTargetSighting(sighting, attribute))

      let sightingToSend = _.assign(
        _.omit(sighting.toJS(), ['type', 'localTargetId', 'id', 'creator', 'geotag', 'target.type']),
        _.omit(attribute.toJS(), ['target.type']))
      if (sighting.get('type') === 'emergent' || sighting.get('offaxis')) {
        delete sightingToSend.target
      }

      const successCallback = data => {
        SnackbarUtil.render('Succesfully updated target sighting')
        let receivedSighting = fromJS(data).set('type', sighting.get('type'))
        if (!_.isNil(receivedSighting.get('target'))) {
          receivedSighting = receivedSighting.update('target', t => t.set('type', sighting.get('type')))
        }
        if (!_.has(data, 'target') && sighting.has('localTargetId')) {
          receivedSighting = receivedSighting.set('localTargetId', sighting.get('localTargetId'))
        }
        dispatch(action.succeedUpdateTargetSighting(receivedSighting, attribute))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update target sighting')
        dispatch(action.failUpdateTargetSighting(sighting, attribute))
      }

      TargetSightingRequests.updateTargetSighting(sighting.get('type') === 'alphanum', sighting.get('id'), sightingToSend, successCallback, failureCallback)
    }
  )
}

export default TargetSightingOperations
