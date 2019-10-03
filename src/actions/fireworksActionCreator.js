/* TODO: Create four Fireworks actions. These are the actions that will be "dispatched" when you want to change the Fireworks
state/"store". This state/"store" is what gets updated periodically by requesting the current Fireworks setting from the plane.
In terms of creating the code for the actions, it should be almost identical to the code found in cameraActionCreator.js.
The only difference between the two files should be that in this file, all the actions' names should have "FIREWORKS" instead
of "CAMERA". */
export const receiveFirewordSettings = settings => ({
  type: 'RECEIVE_FIREWORK_SETTINGS',
  settings
})

export const receiveAndUpdateFireworkSettings = settings => ({
  type: 'UPDATE_FIREWORK_SETTINGS_SUCCESS',
  settings
})

export const updateFireworkSettingsStart = settings => ({
  type: 'UPDATE_FIREWORK_SETTINGS_STARTED',
  settings
})

export const updateFireworkSettingsFailed = () => ({
  type: 'UPDATE_FIREWORK_SETTINGS_FAILED'
})