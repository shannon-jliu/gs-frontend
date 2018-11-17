export const addTargetSighting = (sighting, assignment) => ({
  type: 'ADD_TARGET_SIGHTING',
  sighting,
  assignment
})

export const deleteTargetSighting = sighting => ({
  type: 'DELETE_TARGET_SIGHTING',
  sighting
})

export const startSaveTargetSighting = sighting => ({
  type: 'START_SAVE_TARGET_SIGHTING',
  sighting
})

export const succeedSaveTargetSighting = (newSighting, sighting) => ({
  type: 'SUCCEED_SAVE_TARGET_SIGHTING',
  newSighting,
  sighting
})

export const failSaveTargetSighting = sighting => ({
  type: 'FAIL_SAVE_TARGET_SIGHTING',
  sighting
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
