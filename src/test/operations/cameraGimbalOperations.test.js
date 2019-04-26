import { fromJS, Map } from 'immutable'

import { SettingsRequest } from '../../util/sendApi.js'
import { SettingsGetRequests } from '../../util/receiveApi.js'
import CameraGimbalOperations from '../../operations/cameraGimbalOperations.js'
import * as action from '../../actions/cameraGimbalActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('CameraGimbalOperations', () => {
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
      SettingsGetRequests.getCameraGimbalSetting = jest.fn((successCallback, failureCallback) => successCallback(setting))
      CameraGimbalOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(SettingsGetRequests.getCameraGimbalSetting.mock.calls[0][0])).toBe(JSON.stringify(CameraGimbalOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getCameraGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getCameraGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      SettingsGetRequests.getCameraGimbalSetting = jest.fn((successCallback, failureCallback) => failureCallback())
      CameraGimbalOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(SettingsGetRequests.getCameraGimbalSetting.mock.calls[0][0])).toBe(JSON.stringify(CameraGimbalOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getCameraGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getCameraGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('updateSettingsStart', () => {
    it('updates the gimbal settings when succeeds', () => {
      SettingsRequest.updateCameraGimbalSetting = jest.fn((settings, successCallback, failureCallback) => successCallback(setting))
      CameraGimbalOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.receiveAndUpdateSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateCameraGimbalSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.failureCallback))
      expect(SettingsRequest.updateCameraGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully updated gimbal setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('sets pending to an empty Map() when fails', () => {
      SettingsRequest.updateCameraGimbalSetting = jest.fn((settings, successCallback, failureCallback) => failureCallback())
      CameraGimbalOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.updateSettingsFailed(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateCameraGimbalSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateCameraGimbalSetting.failureCallback))
      expect(SettingsRequest.updateCameraGimbalSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update gimbal setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
