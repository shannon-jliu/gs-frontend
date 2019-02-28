import { fromJS } from 'immutable'

import { SettingsRequest } from '../../util/sendApi.js'
import { SettingsGetRequests } from '../../util/receiveApi.js'
import AirdropOperations from '../../operations/airdropOperations.js'
import * as action from '../../actions/airdropActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('AirdropOperations', () => {
  const setting = fromJS({
    timestamp: 1443826874918,
    isArmed: false,
    commandDropNow: false,
    gpsTargetLocation: {
      latitude: 15.6,
      longitude: 29.4
    },
    acceptableThresholdFt: 91
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getSetting', () => {
    it('gets the airdrop settings when succeeds', () => {
      SettingsGetRequests.getAirdropSetting = jest.fn((successCallback, failureCallback) => successCallback(setting))
      AirdropOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledWith(action.receiveSettings(setting))
      expect(dispatch).toHaveBeenCalledTimes(1)

      expect(JSON.stringify(SettingsGetRequests.getAirdropSetting.mock.calls[0][0])).toBe(JSON.stringify(AirdropOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getAirdropSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getAirdropSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })

    it('does nothing when fails', () => {
      SettingsGetRequests.getAirdropSetting = jest.fn((successCallback, failureCallback) => failureCallback())
      AirdropOperations.getSetting(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)

      expect(JSON.stringify(SettingsGetRequests.getAirdropSetting.mock.calls[0][0])).toBe(JSON.stringify(AirdropOperations.getSetting.successCallback))
      expect(JSON.stringify(SettingsGetRequests.getAirdropSetting.mock.calls[0][1])).toBe(JSON.stringify(() => {}))
      expect(SettingsGetRequests.getAirdropSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })
  })

  describe('updateSettingsStart', () => {
    it('updates the airdrop settings when succeeds', () => {
      SettingsRequest.updateAirdropSetting = jest.fn((settings, successCallback, failureCallback) => successCallback(setting))
      AirdropOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.updateSettingsSuccessFinish(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateAirdropSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateAirdropSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateAirdropSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateAirdropSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateAirdropSetting.failureCallback))
      expect(SettingsRequest.updateAirdropSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully updated airdrop setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('sets pending to an empty Map() when fails', () => {
      SettingsRequest.updateAirdropSetting = jest.fn((settings, successCallback, failureCallback) => failureCallback())
      AirdropOperations.updateSettingsStart(dispatch)(setting)

      expect(dispatch).toHaveBeenCalledWith(action.updateSettingsFailedFinish(setting))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(SettingsRequest.updateAirdropSetting.mock.calls[0][0]).toBe(setting)
      expect(JSON.stringify(SettingsRequest.updateAirdropSetting.mock.calls[0][1])).toBe(JSON.stringify(SettingsRequest.updateAirdropSetting.successCallback))
      expect(JSON.stringify(SettingsRequest.updateAirdropSetting.mock.calls[0][2])).toBe(JSON.stringify(SettingsRequest.updateAirdropSetting.failureCallback))
      expect(SettingsRequest.updateAirdropSetting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update airdrop setting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
