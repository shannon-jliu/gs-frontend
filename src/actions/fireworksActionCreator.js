export const receiveSettings = settings => ({
  type: 'RECEIVE_FIREWORKS_SETTINGS',
  settings
})

export const receiveAndUpdateSettings = settings => ({
  type: 'UPDATE_FIREWORKS_SETTINGS_SUCCESS',
  settings
})

export const updateSettingsStart = settings => ({
  type: 'UPDATE_FIREWORKS_SETTINGS_STARTED',
  settings
})

export const updateSettingsFailed = () => ({
  type: 'UPDATE_FIREWORKS_SETTINGS_FAILED'
})
