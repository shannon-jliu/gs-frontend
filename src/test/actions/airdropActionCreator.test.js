import { fromJS } from 'immutable'
import {
  receiveSettings,
  receiveSettingsUpdate,
  updateSettingsStart,
  updateSettingsSuccessFinish,
  updateSettingsFailedFinish
} from '../../actions/airdropActionCreator.js'

const settings = fromJS({
  'id': 1,
  'timestamp': 1443826874918,
  'gpsTargetLocation': {
    'latitude': 29.4,
    'longitude': 28.3
  },
  'acceptableThresholdFt': 100,
  'isArmed': false,
  'commandDropNow': false
})

it('should create an action when it receives airdrop settings', () => {
  const expectedAction = {
    type: 'RECEIVE_AIRDROP_SETTINGS',
    settings
  }
  expect(receiveSettings(settings)).toEqual(expectedAction)
})

it('should create an action when it succeeds setting updating airdrop settings', () => {
  const expectedAction = {
    type: 'UPDATE_AIRDROP_SETTINGS_SUCCESS',
    settings
  }
  expect(receiveSettingsUpdate(settings)).toEqual(expectedAction)
})

it('should create an action when it starts updating airdrop settings', () => {
  const expectedAction = {
    type: 'UPDATE_AIRDROP_SETTINGS_STARTED',
    settings
  }
  expect(updateSettingsStart(settings)).toEqual(expectedAction)
})

it('should create an action when it succeeds updating airdrop settings', () => {
  const expectedAction = {
    type: 'UPDATE_AIRDROP_SETTINGS_SUCCESS',
    settings
  }
  expect(updateSettingsSuccessFinish(settings)).toEqual(expectedAction)
})

it('should create an action when it fails updating airdrop settings', () => {
  const expectedAction = {
    type: 'UPDATE_AIRDROP_SETTINGS_FAILED',
    settings
  }
  expect(updateSettingsFailedFinish(settings)).toEqual(expectedAction)
})
