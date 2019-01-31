export const receiveCameraSettings = settings => ({
  type: 'RECEIVE_CAMERA_SETTINGS',
  settings
})

export const receiveAndUpdateCameraSettings = settings => ({
  type: 'UPDATE_CAMERA_SETTINGS_SUCCESS',
  settings
})

export const updateCameraSettingsStart = settings => ({
  type: 'UPDATE_CAMERA_SETTINGS_STARTED',
  settings
})

export const updateCameraSettingsFailed = () => ({
  type: 'UPDATE_CAMERA_SETTINGS_FAILED'
})
