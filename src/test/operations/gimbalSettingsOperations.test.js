import { fromJS, Map } from 'immutable'

import { SettingsRequest } from '../../util/sendApi.js'
import { SettingsGetRequests } from '../../util/receiveApi.js'
import GimbalSettingsOperations from '../../operations/gimbalSettingsOperations.js'
import * as action from '../../actions/gimbalSettingsActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('GimbalSettingsOperations', () => {
  const setting = fromJS({
    timestamp: 1443826874918,
    gps: {
      latitude: 0,
      longitude: 0
    },
    orientation: {
      roll: 0,
      pitch: 0
    }
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getSetting', () => {
    it('gets the gimbal settings when succeeds', () => {
      SettingsGetRequests.getGimbalSettingsSetting = jest.fn((successCallback, failureCallback) => successCallback(setting))
      GimbalSettingsOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(SettingsGetRequests.getGimbalSettingsSetting.mock.calls[0][0])).toBe(JSON.stringify(GimbalSettingsOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getGimbalSettingsSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getGimbalSettingsSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      SettingsGetRequests.getGimbalSettingsSetting = jest.fn((successCallback, failureCallback) => failureCallback())
      GimbalSettingsOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(SettingsGetRequests.getGimbalSettingsSetting.mock.calls[0][0])).toBe(JSON.stringify(GimbalSettingsOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getGimbalSettingsSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getGimbalSettingsSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('updateSettingsStart', () => {
    it('updates the gimbal settings when succeeds', () => {
      SettingsRequest.updateGimbalSettingsSetting = jest.fn((settings, successCallback, failureCallback) => successCallback(setting))
      GimbalSettingsOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.receiveAndUpdateSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateGimbalSettingsSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.failureCallback))
      expect(SettingsRequest.updateGimbalSettingsSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully updated gimbal settings setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('sets pending to an empty Map() when fails', () => {
      SettingsRequest.updateGimbalSettingsSetting = jest.fn((settings, successCallback, failureCallback) => failureCallback())
      GimbalSettingsOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.updateSettingsFailed(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateGimbalSettingsSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateGimbalSettingsSetting.failureCallback))
      expect(SettingsRequest.updateGimbalSettingsSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update gimbal settings setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
