import { fromJS, Map } from 'immutable'

import { SettingsRequest } from '../../util/sendApi.js'
import { SettingsGetRequests } from '../../util/receiveApi.js'
import CameraOperations from '../../operations/cameraOperations.js'
import * as action from '../../actions/cameraActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('CameraOperations', () => {
  const setting = fromJS({
    timestamp: 1443826874918,
    capturing: true,
    zoom: 0
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getCapturing', () => {
    it('gets the capturing property when succeeds', () => {
      SettingsGetRequests.getCameraSettingCapturing = jest.fn((successCallback, failureCallback) => successCallback())
      CameraOperations.getCapturing(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveCameraSettings())
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(SettingsGetRequests.getCameraSettingCapturing.mock.calls[0][0])).toBe(JSON.stringify(CameraOperations.getCapturing.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getCameraSettingCapturing.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getCameraSettingCapturing).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      SettingsGetRequests.getCameraSettingCapturing = jest.fn((successCallback, failureCallback) => failureCallback())
      CameraOperations.getCapturing(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(SettingsGetRequests.getCameraSettingCapturing.mock.calls[0][0])).toBe(JSON.stringify(CameraOperations.getCapturing.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getCameraSettingCapturing.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getCameraSettingCapturing).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('getZoom', () => {
    it('gets the capturing property when succeeds', () => {
      SettingsGetRequests.getCameraSettingZoom = jest.fn((successCallback, failureCallback) => successCallback())
      CameraOperations.getZoom(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveCameraSettings())
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(SettingsGetRequests.getCameraSettingZoom.mock.calls[0][0])).toBe(JSON.stringify(CameraOperations.getZoom.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getCameraSettingZoom.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getCameraSettingZoom).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      SettingsGetRequests.getCameraSettingZoom = jest.fn((successCallback, failureCallback) => failureCallback())
      CameraOperations.getZoom(dispatch)
      
      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(SettingsGetRequests.getCameraSettingZoom.mock.calls[0][0])).toBe(JSON.stringify(CameraOperations.getZoom.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getCameraSettingZoom.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getCameraSettingZoom).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('updateSettingsStart', () => {
    it('updates the camera settings when succeeds', () => {
      SettingsRequest.updateCameraSetting = jest.fn((settings, successCallback, failureCallback) => successCallback())
      CameraOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.receiveAndUpdateCameraSettings())
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateCameraSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateCameraSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateCameraSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateCameraSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateCameraSetting.failureCallback))
      expect(SettingsRequest.updateCameraSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully updated camera setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('sets pending to an empty Map() when fails', () => {
      SettingsRequest.updateCameraSetting = jest.fn((settings, successCallback, failureCallback) => failureCallback())
      CameraOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.updateCameraSettingsFailed(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateCameraSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateCameraSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateCameraSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateCameraSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateCameraSetting.failureCallback))
      expect(SettingsRequest.updateCameraSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update camera setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
