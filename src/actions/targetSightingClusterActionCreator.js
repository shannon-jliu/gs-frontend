export const startUpdateTargetSightingCluster = (sightingCluster, attribute) => ({
  type: 'START_UPDATE_TARGET_SIGHTING_CLUSTER',
  sightingCluster,
  attribute
})

export const succeedUpdateTargetSightingCluster = (newsightingCluster, attribute) => ({
  type: 'SUCCEED_UPDATE_TARGET_SIGHTING_CLUSTER',
  newsightingCluster,
  attribute
})

export const failUpdateTargetSightingCluster = (sightingCluster, attribute) => ({
  type: 'FAIL_UPDATE_TARGET_SIGHTING_CLUSTER',
  sightingCluster,
  attribute
})

export const addTargetSightingClustersFromServer = sightings => ({
  type: 'ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER',
  sightings
})

export const removeTargetFromTargetSightingClusters = target => ({
  type: 'REMOVE_TARGET_FROM_TARGET_SIGHTING_CLUSTERS',
  target
})
