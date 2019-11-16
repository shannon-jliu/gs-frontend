import {
  startUpdateTargetSightingCluster,
  succeedUpdateTargetSightingCluster,
  failUpdateTargetSightingCluster,
  addTargetSightingClustersFromServer,
  removeTargetFromTargetSightingClusters
} from '../../actions/targetSightingClusterActionCreator.js'
import { fromJS } from 'immutable'

describe('targetSightingClusterActionCreator', () => {
  const sighting = fromJS({
    'id': 1,
    'timestamp': 1443826874918,
    'target': null,
    'type': 'alphanum',
    'color': 'blue'
  })

  const sightingCluster = fromJS({
    'id': 1,
    'target': null,
    'type': 'alphanum',
    'sightings': [1]
  })

  const attribute = fromJS({
    'color': 'red'
  })

  describe('START_UPDATE_TARGET_SIGHTING_CLUSTER', () => {
    it('should create an action when it starts update of target sighting cluster', () => {
      const expectedAction = {
        type: 'START_UPDATE_TARGET_SIGHTING_CLUSTER',
        sightingCluster,
        attribute
      }
      expect(startUpdateTargetSightingCluster(sightingCluster, attribute)).toEqual(expectedAction)
    })
  })

  describe('SUCCEED_UPDATE_TARGET_SIGHTING_CLUSTER', () => {
    it('should create an action when it succeeds update of target sighting cluster', () => {
      const expectedAction = {
        type: 'SUCCEED_UPDATE_TARGET_SIGHTING_CLUSTER',
        sightingCluster,
        attribute
      }
      expect(succeedUpdateTargetSightingCluster(sightingCluster, attribute)).toEqual(expectedAction)
    })
  })

  describe('FAIL_UPDATE_TARGET_SIGHTING_CLUSTER', () => {
    it('should create an action when it fails update of target sighting cluster', () => {
      const expectedAction = {
        type: 'FAIL_UPDATE_TARGET_SIGHTING_CLUSTER',
        sightingCluster,
        attribute
      }
      expect(failUpdateTargetSightingCluster(sightingCluster, attribute)).toEqual(expectedAction)
    })
  })

  describe('ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER', () => {
    it('should create an action when it adds target sightings from server', () => {
      const newSightingClusters = fromJS([
        sightingCluster.toJS(),
        {
          'id': 2,
          'target': null,
          'type': 'alphanum',
          'sightings': [3]
        }])

      const expectedAction = {
        type: 'ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER',
        sightingClusters: newSightingClusters
      }
      expect(addTargetSightingClustersFromServer(newSightingClusters)).toEqual(expectedAction)
    })
  })

  describe('REMOVE_TARGET_FROM_TARGET_SIGHTING_CLUSTERS', () => {
    it('should create an action when it fails update of target sighting', () => {
      const target = fromJS({ id: 5 })

      const expectedAction = {
        type: 'REMOVE_TARGET_FROM_TARGET_SIGHTING_CLUSTERS',
        target
      }
      expect(removeTargetFromTargetSightingClusters(target)).toEqual(expectedAction)
    })
  })
})
