export const addTargetSighting = (sighting, assignment) => ({
  type: 'ADD_TARGET_SIGHTING',
  sighting,
  assignment
})

export const deleteTargetSighting = sighting => ({
  type: 'DELETE_TARGET_SIGHTING',
  sighting
})

export const startSaveTargetSighting = localId => ({
  type: 'START_SAVE_TARGET_SIGHTING',
  localId
})

export const succeedSaveTargetSighting = (sighting, localId) => ({
  type: 'SUCCEED_SAVE_TARGET_SIGHTING',
  sighting,
  localId
})

export const failSaveTargetSighting = localId => ({
  type: 'FAIL_SAVE_TARGET_SIGHTING',
  localId
})

export const startUpdateTargetSighting = (sighting, attribute) => ({
  type: 'START_UPDATE_TARGET_SIGHTING',
  sighting,
  attribute
})

export const succeedUpdateTargetSighting = (newSighting, attribute) => ({
  type: 'SUCCEED_UPDATE_TARGET_SIGHTING',
  newSighting,
  attribute
})

export const failUpdateTargetSighting = (sighting, attribute) => ({
  type: 'FAIL_UPDATE_TARGET_SIGHTING',
  sighting,
  attribute
})

export const addTargetSightingsFromServer = sightings => ({
  type: 'ADD_TARGET_SIGHTINGS_FROM_SERVER',
  sightings
})

export const removeTargetFromTargetSightings = target => ({
  type: 'REMOVE_TARGET_FROM_TARGET_SIGHTINGS',
  target
})
