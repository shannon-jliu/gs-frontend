import { fromJS } from 'immutable'

import { FireworksPostRequests } from '../../util/sendApi.js'
import { FireworksGetRequests } from '../../util/receiveApi.js'
import FireworksOperations from '../../operations/fireworksOperations.js'
import * as action from '../../actions/fireworksActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('FireworksOperations', () => {
  const setting = fromJS({
    timestamp: 1443826874918,
    color: 'blue',
    number: 5
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getSetting', () => {
    it('gets the fireworks settings when succeeds', () => {
      FireworksGetRequests.getFireworksSetting = jest.fn((successCallback, failureCallback) => successCallback(setting))
      FireworksOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(FireworksGetRequests.getFireworksSetting.mock.calls[0][0])).toBe(JSON.stringify(FireworksOperations.getSetting.successCallback))
      expect(JSON.stringify(FireworksGetRequests.getFireworksSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(FireworksGetRequests.getFireworksSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      FireworksGetRequests.getFireworksSetting = jest.fn((successCallback, failureCallback) => failureCallback())
      FireworksOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(FireworksGetRequests.getFireworksSetting.mock.calls[0][0])).toBe(JSON.stringify(FireworksOperations.getSetting.successCallback))
      expect(JSON.stringify(FireworksGetRequests.getFireworksSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(FireworksGetRequests.getFireworksSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('updateSettingsStart', () => {
    it('updates the fireworks settings when succeeds', () => {
      FireworksPostRequests.updateFireworksSetting = jest.fn((settings, successCallback, failureCallback) => successCallback(setting))
      FireworksOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.receiveAndUpdateSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(FireworksPostRequests.updateFireworksSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(FireworksPostRequests.updateFireworksSetting.mock.calls[0][1])).toBe(JSON.stringify(FireworksPostRequests.updateFireworksSetting.successCallback))
      expect(JSON.stringify(FireworksPostRequests.updateFireworksSetting.mock.calls[0][2])).toBe(JSON.stringify(FireworksPostRequests.updateFireworksSetting.failureCallback))
      expect(FireworksPostRequests.updateFireworksSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully updated fireworks setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('sets pending to an empty Map() when fails', () => {
      FireworksPostRequests.updateFireworksSetting = jest.fn((settings, successCallback, failureCallback) => failureCallback())
      FireworksOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.updateSettingsFailed(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(FireworksPostRequests.updateFireworksSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(FireworksPostRequests.updateFireworksSetting.mock.calls[0][1])).toBe(JSON.stringify(FireworksPostRequests.updateFireworksSetting.successCallback))
      expect(JSON.stringify(FireworksPostRequests.updateFireworksSetting.mock.calls[0][2])).toBe(JSON.stringify(FireworksPostRequests.updateFireworksSetting.failureCallback))
      expect(FireworksPostRequests.updateFireworksSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update fireworks setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
