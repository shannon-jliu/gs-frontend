export const receiveSettings = settings => ({
  type: 'RECEIVE_CAMERA_GIMBAL_SETTINGS',
  settings
})

export const receiveAndUpdateSettings = settings => ({
  type: 'UPDATE_CAMERA_GIMBAL_SETTINGS_SUCCESS',
  settings
})

export const updateSettingsStart = settings => ({
  type: 'UPDATE_CAMERA_GIMBAL_SETTINGS_STARTED',
  settings
})

export const updateSettingsFailed = () => ({
  type: 'UPDATE_CAMERA_GIMBAL_SETTINGS_FAILED'
})
