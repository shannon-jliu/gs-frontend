import { fromJS, Map } from 'immutable'

import { UtilGetRequests } from '../../util/receiveApi.js'
import UtilOperations from '../../operations/utilOperations.js'
import * as action from '../../actions/utilActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('CameraOperations', () => {
  const state = fromJS({
    usersEnabled: true
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getUsersEnabled', () => {
    it('gets the usersEnabled property when succeeds', () => {
      UtilGetRequests.getUsersEnabled = jest.fn((successCallback, failureCallback) => successCallback(state))
      UtilOperations.getUsersEnabled(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveUsersEnabled(state))
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(UtilGetRequests.getUsersEnabled.mock.calls[0][0])).toBe(JSON.stringify(UtilOperations.getUsersEnabled.successCallback))
      expect(JSON.stringify(UtilGetRequests.getUsersEnabled.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(UtilGetRequests.getUsersEnabled).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      UtilGetRequests.getUsersEnabled = jest.fn((successCallback, failureCallback) => failureCallback())
      UtilOperations.getUsersEnabled(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(UtilGetRequests.getUsersEnabled.mock.calls[0][0])).toBe(JSON.stringify(UtilOperations.getUsersEnabled.failureCallback))
      expect(JSON.stringify(UtilGetRequests.getUsersEnabled.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(UtilGetRequests.getUsersEnabled).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })
})
