import { fromJS } from 'immutable'
import * as action from '../actions/utilActionCreator.js'
import { UtilGetRequests } from '../util/receiveApi.js'
import SnackbarUtil from '../util/snackbarUtil.js'

const UtilOperations = {
  getUsersEnabled: dispatch => {
    const successCallback = usersEnabled => {
      dispatch(action.receiveUsersEnabled(fromJS(usersEnabled)))
    }

    UtilGetRequests.getUsersEnabled(successCallback, () => {})
  }
}

export default UtilOperations
