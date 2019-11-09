export const addTargetSightingCluster = (sighting, assignment) => ({
  type: 'ADD_TARGET_SIGHTING_CLUSTER',
  sighting,
  assignment
})

export const deleteTargetSightingCluster = sighting => ({
  type: 'DELETE_TARGET_SIGHTING_CLUSTER',
  sighting
})

export const startSaveTargetSightingCluster = localId => ({
  type: 'START_SAVE_TARGET_SIGHTING_CLUSTER',
  localId
})

export const succeedSaveTargetSightingCluster = (sighting, localId) => ({
  type: 'SUCCEED_SAVE_TARGET_SIGHTING_CLUSTER',
  sighting,
  localId
})

export const failSaveTargetSightingCluster = localId => ({
  type: 'FAIL_SAVE_TARGET_SIGHTING_CLUSTER',
  localId
})

export const startUpdateTargetSightingCluster = (sighting, attribute) => ({
  type: 'START_UPDATE_TARGET_SIGHTING_CLUSTER',
  sighting,
  attribute
})

export const succeedUpdateTargetSightingCluster = (newSighting, attribute) => ({
  type: 'SUCCEED_UPDATE_TARGET_SIGHTING_CLUSTER',
  newSighting,
  attribute
})

export const failUpdateTargetSightingCluster = (sighting, attribute) => ({
  type: 'FAIL_UPDATE_TARGET_SIGHTING_CLUSTER',
  sighting,
  attribute
})

export const addTargetSightingClustersFromServer = sightings => ({
  type: 'ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER',
  sightings
})

export const deleteTargetFromTargetSightingClusters = target => ({
  type: 'DELETE_TARGET_FROM_TARGET_SIGHTING_CLUSTERS',
  target
})
