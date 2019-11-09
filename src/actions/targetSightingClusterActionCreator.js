export const addTargetSightingClustersFromServer = sightings => ({
  type: 'ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER',
  sightings
})

export const removeTargetFromTargetSightingClusters = target => ({
  type: 'REMOVE_TARGET_FROM_TARGET_SIGHTING_CLUSTERS',
  target
})
