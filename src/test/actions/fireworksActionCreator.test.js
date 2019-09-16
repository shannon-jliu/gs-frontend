import { fromJS } from 'immutable'
import {
  receiveSettings,
  receiveAndUpdateSettings,
  updateSettingsStart,
  updateSettingsFailed
} from '../../actions/fireworksActionCreator.js'


const settings = fromJS({
  'id': 1,
  'timestamp': 1443826874918,
  'color': 'blue',
  'number': 5
})

it('should create an action when it receives fireworks settings', () => {

  const expectedAction = {
    type: 'RECEIVE_FIREWORKS_SETTINGS',
    settings
  }
  expect(receiveSettings(settings)).toEqual(expectedAction)
})

it('should create an action when it starts updating fireworks settings', () => {
  const expectedAction = {
    type: 'UPDATE_FIREWORKS_SETTINGS_STARTED',
    settings
  }
  expect(updateSettingsStart(settings)).toEqual(expectedAction)
})

it('should create an action when it fails updating fireworks settings', () => {
  const expectedAction = {
    type: 'UPDATE_FIREWORKS_SETTINGS_FAILED'
  }
  expect(updateSettingsFailed()).toEqual(expectedAction)
})

it('should create an action when it succeeds updating fireworks settings', () => {
  const expectedAction = {
    type: 'UPDATE_FIREWORKS_SETTINGS_SUCCESS',
    settings
  }
  expect(receiveAndUpdateSettings(settings)).toEqual(expectedAction)
})
