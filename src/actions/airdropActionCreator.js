export const receiveSettings = (settings) => ({
  type: 'RECEIVE_AIRDROP_SETTINGS',
  settings
})

export const receiveSettingsUpdate = (settings) => ({
  type: 'UPDATE_AIRDROP_SETTINGS_SUCCESS',
  settings
})

export const updateSettingsStart = (settings) => ({
  type: 'UPDATE_AIRDROP_SETTINGS_STARTED',
  settings
})

export const updateSettingsSuccessFinish = (settings) => ({
  type: 'UPDATE_AIRDROP_SETTINGS_SUCCESS',
  settings
})

export const updateSettingsFailedFinish = (settings) => ({
  type: 'UPDATE_AIRDROP_SETTINGS_FAILED',
  settings
})
