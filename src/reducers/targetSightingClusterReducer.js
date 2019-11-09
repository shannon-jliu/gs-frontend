import { fromJS, merge, List, Map } from 'immutable'
import _ from 'lodash'

/**
 * Notes on state representation:
 * - local is the list of unsaved (locally created, not yet saved on backend) ts.
 * - saved is the list of ts saved on the backend
 * - local tsc have a string localId parameter
 * - saved tsc have an int id parameter. Thses are assigned by the backend and will overlap for different target types
 * - if the tsc is attatched to a target, it either has a target (full object) or localTargetId (just target's localId) field
 * - the pending field in a tsc is set iff some part of the tsc is saving
 *   - if the tsc is being created on the backend (and is currently local), it is empty
 *   - if specific attributes are being updated, those attributes are all stored in pending
*/
const initialState = fromJS({
  local: [],
  saved: []
})

const targetSightingReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER':
    return addTargetSightingClustersFromServer(state, action.sightings)
  case 'REMOVE_TARGET_FROM_TARGET_SIGHTING_CLUSTERS':
    return removeTargetFromTargetSightingClusters(state, action.target)
  default:
    return state
  }
}

function addTargetSightingClustersFromServer(state, sightings) {
  const savedById = _.keyBy(state.get('saved').toJSON(), o => o.get('id') + ':' + o.get('type'))
  return state.set(
    'saved',
    sightings.map(ts => {
      if (_.isObject(savedById[ts.get('id') + ':' + ts.get('type')])) {
        const savedTs = fromJS(savedById[ts.get('id') + ':' + ts.get('type')])
        ts = savedTs.get('pending') != undefined ? ts.set('pending', savedTs.get('pending')) : ts
        ts = savedTs.get('localTargetId') != undefined ? ts.set('localTargetId', savedTs.get('localTargetId')) : ts
      }
      return ts
    })
  )
}
function removeTargetFromTargetSightingClusters(state, target) {
  const targetId = target.get('id')
  const type = target.get('type')
  return state.update('saved', s => s.map(ts =>
    ts.getIn(['target', 'id']) == targetId && ts.get('type') == type ? ts.delete('target') : ts))
}

export default targetSightingReducer
