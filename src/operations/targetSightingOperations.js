import { fromJS } from 'immutable'
import _ from 'lodash'

import * as action from '../actions/targetSightingActionCreator.js'
import { targetSightingRequests } from '../util/sendApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const TargetSightingOperations = {
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
      const failureCallback = () => {
        SnackbarUtil.render('Failed to delete target sighting')
        TargetSightingOperations.addTargetSighting(dispatch)(sighting, sighting.get('assignment'))
      }

      targetSightingRequests.deleteTargetSighting(sighting.get('type') == 'alphanum', sighting.get('id'), () => ({}), failureCallback)
    }
  ),

  saveTargetSighting: dispatch => (
    sighting => {
      dispatch(action.startSaveTargetSighting(sighting.get('localId')))

      const sightingToSend = _.assign(
        _.omit(sighting.toJS(), ['localId', 'type']),
        { creator: 'MDLC' })

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

      targetSightingRequests.saveTargetSighting(sighting.get('type') == 'alphanum', sighting.getIn(['assignment', 'id']), sightingToSend, successCallback, failureCallback)
    }
  ),

  updateTargetSighting: dispatch => (
    (sighting, attribute) => {
      //in the future, this will send specific requests per attribute (but has to be implemented on BE first)
      dispatch(action.startUpdateTargetSighting(sighting, attribute))

      let sightingToSend = _.assign(
        _.omit(sighting.toJS(), ['type', 'localTargetId', 'id', 'creator', 'geotag']),
        attribute.toJS())
      if (sighting.get('type') == 'emergent' || sighting.get('offaxis')) {
        sightingToSend = _.omit(sightingToSend, ['target'])
      }

      const successCallback = data => {
        SnackbarUtil.render('Succesfully updated target sighting')
        let receivedSighting = fromJS(data).set('type', sighting.get('type'))
        if (!_.has(data, 'target') && sighting.has('localTargetId')) {
          receivedSighting = receivedSighting.set('localTargetId', sighting.get('localTargetId'))
        }
        dispatch(action.succeedUpdateTargetSighting(receivedSighting, attribute))
      }

      const failureCallback = () => {
        SnackbarUtil.render('Failed to update target sighting')
        dispatch(action.failUpdateTargetSighting(sighting, attribute))
      }

      targetSightingRequests.updateTargetSighting(sighting.get('type') == 'alphanum', sighting.get('id'), sightingToSend, successCallback, failureCallback)
    }
  )
}

export default TargetSightingOperations
