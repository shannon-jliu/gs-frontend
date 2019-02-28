import { fromJS, Map } from 'immutable'

import { SettingsRequest } from '../../util/sendApi.js'
import { SettingsGetRequests } from '../../util/receiveApi.js'
import GimbalOperations from '../../operations/gimbalOperations.js'
import * as action from '../../actions/gimbalActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('GimbalOperations', () => {
  const setting = fromJS({
    timestamp: 1443826874918,
    mode: 0
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getSetting', () => {
    it('gets the gimbal settings when succeeds', () => {
      SettingsGetRequests.getGimbalSetting = jest.fn((successCallback, failureCallback) => successCallback(setting))
      GimbalOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(SettingsGetRequests.getGimbalSetting.mock.calls[0][0])).toBe(JSON.stringify(GimbalOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      SettingsGetRequests.getGimbalSetting = jest.fn((successCallback, failureCallback) => failureCallback())
      GimbalOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(SettingsGetRequests.getGimbalSetting.mock.calls[0][0])).toBe(JSON.stringify(GimbalOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('updateSettingsStart', () => {
    it('updates the gimbal settings when succeeds', () => {
      SettingsRequest.updateGimbalSetting = jest.fn((settings, successCallback, failureCallback) => successCallback(setting))
      GimbalOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.receiveAndUpdateSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateGimbalSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateGimbalSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateGimbalSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateGimbalSetting.failureCallback))
      expect(SettingsRequest.updateGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully updated gimbal setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('sets pending to an empty Map() when fails', () => {
      SettingsRequest.updateGimbalSetting = jest.fn((settings, successCallback, failureCallback) => failureCallback())
      GimbalOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.updateSettingsFailed(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateGimbalSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateGimbalSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateGimbalSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateGimbalSetting.failureCallback))
      expect(SettingsRequest.updateGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update gimbal setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
