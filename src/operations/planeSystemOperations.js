import { fromJS } from 'immutable'

import * as action from '../actions/planeSystemActionCreator.js'

import { PlaneSystemGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const PlaneSystemOperations = {
  getImage: dispatch => (
    () => {
      const successCallback = data => {
        dispatch(action.receiveImage(data.responseText))
      }

      PlaneSystemGetRequests.getImage(successCallback)
    }
  )
}

export default PlaneSystemOperations
