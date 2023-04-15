export const receiveSettings = settings => ({
  type: 'RECEIVE_FIVE_TARGETS_SETTINGS',
  settings
})

export const receiveAndUpdateSettings = settings => ({
  type: 'UPDATE_FIVE_TARGETS_SETTINGS_SUCCESS',
  settings
})

export const updateSettingsStart = settings => ({
  type: 'UPDATE_FIVE_TARGETS_SETTINGS_STARTED',
  settings
})

export const updateSettingsFailed = () => ({
  type: 'UPDATE_FIVE_TARGETS_SETTINGS_FAILED'
})

// to store number of targets used in the global state
export const updateNumTargets = (targetsNum) => ({
  type: 'UPDATE_NUM_TARGETS',
  targetsNum,
})
