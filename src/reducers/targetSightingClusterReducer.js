import { fromJS, merge, List, Map } from 'immutable'
import _ from 'lodash'

/**
 * @typedef {Object} TargetSightingCluster
 * @property {number} id the id of this target sighting cluster
 * @property {?string} targetId the id of the target that this cluster represents
 * @property {?string} localTargetId the id of the target this cluster represents on the frontend
 */

/**
 * Notes on state representation:
 * - target sighting clusters are not created by the user, but by an automatic script on the backend
 * - this means that the user cannot create them, so there is no need for local and saved
 * 
 * - saved tsc have an int id parameter. these are assigned by the backend and will overlap for different target types
 * - if the tsc is attatched to a target, it either has a target (full object) or localTargetId (just target's localId) field
 * - the pending field in a tsc is set iff some part of the tsc is saving
 *   - if the tsc is being created on the backend (and is currently local), it is empty
 *   - if specific attributes are being updated, those attributes are all stored in pending
*/
const initialState = fromJS([])

const targetSightingReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'START_UPDATE_TARGET_SIGHTING_CLUSTER':
    return startUpdateTargetSightingCluster(state, action.sightingCluster, action.attribute)
  case 'SUCCEED_UPDATE_TARGET_SIGHTING_CLUSTER':
  case 'FAIL_UPDATE_TARGET_SIGHTING_CLUSTER':
    return clearUpdateTargetSightingCluster(state, action.sightingCluster, action.attribute)
  case 'ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER':
    return addTargetSightingClustersFromServer(state, action.sightings)
  case 'REMOVE_TARGET_FROM_TARGET_SIGHTING_CLUSTERS':
    return removeTargetFromTargetSightingClusters(state, action.target)
  default:
    return state
  }
}

/**
 * add change specified by attribute to pending for this sighting cluster
 * so that it can be sent to the server
 * @param {List} state
 * @param {Map} sightingCluster
 * @param {Map} attribute
 */
function startUpdateTargetSightingCluster(state, sightingCluster, attribute) {
  return state.map(cluster => {
    // if the id and type don't match, leave this cluster alone
    if (!cluster.get('id') !== sightingCluster.get('id') ||
      !cluster.get('type') !== sightingCluster.get('type')) return cluster

    if (!cluster.get('pending')) // if there are no pending changes, set them
      return cluster.set('pending', attribute)
    else // if there are other pending changes, add this to those
      return cluster.set('pending', cluster.get('pending').merge(attribute))
  })
}

/**
 * server has responded to our update, remove it from pending
 * @param {List<Map>} state
 * @param {Map} sightingCluster
 * @param {Map} attribute
 */
function clearUpdateTargetSightingCluster(state, sightingCluster, attribute) {
  return state.map(cluster => {
    // if the id and type don't match, leave this cluster alone
    if (!cluster.get('id') !== sightingCluster.get('id') ||
      !cluster.get('type') !== sightingCluster.get('type')) return cluster

    let pending = cluster.get('pending')
    if (!pending) return cluster

    pending = pending.deleteAll(attribute.keys()) // clear all of the attributes from pending list

    // if pending list is now empty, remove it and we are done
    if (pending.size === 0) return cluster.delete('pending')

    return cluster.set('pending', pending)
  })
}

/**
 * target sighting clusters have been retrieved from server, reconcile
 * this with the data that we already have
 * @param {List<Map>} state 
 * @param {List<Map>} sightingClusters 
 */
function addTargetSightingClustersFromServer(state, sightingClusters) {
  const key = o => o.get('id') + ':' + o.get('type')

  const savedById = _.keyBy(state.toJSON(), key)

  return sightingClusters.map(tsc => {

    const existing = savedById[key(tsc)]

    if (_.isObject(existing)) { // if existing exists
      const savedTsc = fromJS(existing) // convert to immutable
      tsc = savedTsc.get('pending') !== undefined ? tsc.set('pending', savedTsc.get('pending')) : tsc // clear pending
      tsc = savedTsc.get('localTargetId') !== undefined ? tsc.set('localTargetId', savedTsc.get('localTargetId')) : tsc // conserve local id
    }

    return tsc
  })
}

/**
 * most likely this target has just been deleted, so now we are removing references
 * to it
 * @param {List<Map>} state 
 * @param {Map} target 
 */
function removeTargetFromTargetSightingClusters(state, target) {
  const targetId = target.get('id')
  const type = target.get('type')

  return state.map(tsc =>
    tsc.getIn(['target', 'id']) === targetId && tsc.get('type') === type ?
      tsc.delete('target') :
      tsc)
}

export default targetSightingReducer
