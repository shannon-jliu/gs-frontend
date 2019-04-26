import { fromJS } from 'immutable'
import {
  receiveSettings,
  receiveAndUpdateSettings,
  updateSettingsStart,
  updateSettingsFailed
} from '../../actions/cameraGimbalActionCreator.js'


const settings = fromJS({
  'id': 1,
  'timestamp': 1443826874918,
  'mode': 'retract'
})

it('should create an action when it receives gimbal settings', () => {

  const expectedAction = {
    type: 'RECEIVE_CAMERA_GIMBAL_SETTINGS',
    settings
  }
  expect(receiveSettings(settings)).toEqual(expectedAction)
})

it('should create an action when it starts updating gimbal settings', () => {
  const expectedAction = {
    type: 'UPDATE_CAMERA_GIMBAL_SETTINGS_STARTED',
    settings
  }
  expect(updateSettingsStart(settings)).toEqual(expectedAction)
})

it('should create an action when it fails updating gimbal settings', () => {
  const expectedAction = {
    type: 'UPDATE_CAMERA_GIMBAL_SETTINGS_FAILED'
  }
  expect(updateSettingsFailed()).toEqual(expectedAction)
})

it('should create an action when it succeeds updating gimbal settings', () => {
  const expectedAction = {
    type: 'UPDATE_CAMERA_GIMBAL_SETTINGS_SUCCESS',
    settings
  }
  expect(receiveAndUpdateSettings(settings)).toEqual(expectedAction)
})
