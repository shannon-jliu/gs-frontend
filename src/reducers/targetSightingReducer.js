import { fromJS, merge, List, Map } from 'immutable'
import { _ } from 'lodash'

/**
 * Notes on state representation:
 * - local is the list of unsaved (locally created, not yet saved on backend) ts.
 * - saved is the list of ts saved on the backend
 * - local targets have a string localId parameter
 * - saved targets have an int id parameter. Thses are assigned by the backend and will overlap for different target types
 * - if the ts is attatched to a target, it either has a target (full object) or localTargetId (just target's localId) field
 * - the pending field in a ts is set when some part of the ts is saving
 *   - if the ts is being created on the backend (and is currently local), it is empty
 *   - if specific attributes are being updated, those attributes are all stored in pending
*/
const initialState = fromJS({
  local: [],
  saved: []
})

const targetSightingReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'ADD_TARGET_SIGHTING':
    return addTargetSighting(state, action.sighting, action.assignment)
  case 'DELETE_TARGET_SIGHTING':
    return deleteTargetSighting(state, action.sighting.get('localId'), action.sighting.get('id'), action.sighting.get('type'))
  case 'START_SAVE_TARGET_SIGHTING':
    return startSaveTargetSighting(state, action.sighting.get('localId'))
  case 'SUCCEED_SAVE_TARGET_SIGHTING':
    return succeedSaveTargetSighting(state, action.newSighting, action.sighting.get('localId'))
  case 'FAIL_SAVE_TARGET_SIGHTING':
    return failSaveTargetSighting(state, action.sighting.get('localId'))
  case 'START_UPDATE_TARGET_SIGHTING':
    return startUpdateTargetSighting(state, action.sighting, action.attribute)
  case 'SUCCEED_UPDATE_TARGET_SIGHTING':
    return succeedUpdateTargetSighting(state, action.newSighting, action.attribute)
  case 'FAIL_UPDATE_TARGET_SIGHTING':
    return failUpdateTargetSighting(state, action.sighting, action.attribute)
  case 'ADD_TARGET_SIGHTINGS_FROM_SERVER':
    return addTargetSightingsFromServer(state, action.sightings)
  default:
    return state
  }
}

function addTargetSighting(state, sighting, assignment) {
  const newSighting = sighting.merge({ assignment: fromJS(assignment) })
  return state.update('local', l => l.push(newSighting))
}

function deleteTargetSighting(state, localId, id, type) {
  if (_.isString(localId)) {
    return state.update('local', l => l.filter(ts => ts.get('localId') !== localId))
  } else {
    //alphanum and emergent targets have overlapping ids assigned by backend
    return state.update('saved', l => l.filter(ts => ts.get('id') !== id || ts.get('type') !== type))
  }
}

/** saveTargetSighting functions are for saving a local target sighting to the ground server */
function startSaveTargetSighting(state, localId) {
  return state.update('local', l => l.map(ts => ts.get('localId') === localId ? ts.set('pending', fromJS({})) : ts))
}

function succeedSaveTargetSighting(state, sighting, localId) {
  return state
    .update('local', l => l.filter(ts => ts.get('localId') !== localId))
    .update('saved', l => l.push(sighting))
}

function failSaveTargetSighting(state, localId) {
  return state.update('local', l => l.map(ts => ts.get('localId') === localId ? ts.delete('pending') : ts))
}


/** updateTargetSighting functions are for updating an attribute of a target sighting already on ground server */
function startUpdateTargetSighting(state, sighting, attribute) {
  return state.update('saved', l => l.map(ts => {
    if (ts.get('id') === sighting.get('id') && ts.get('type') === sighting.get('type')) {
      if (ts.get('pending') === undefined) {
        return ts.set('pending', attribute)
      } else {
        //overwrite is fine because save should never be called for attribute currently pending save
        return ts.set('pending', ts.get('pending').merge(attribute))
      }
    }
    return ts
  }))
}

function succeedUpdateTargetSighting(state, sighting, attribute) {
  return state.update('saved', l => l.map(ts => {
    if (ts.get('id') === sighting.get('id') && ts.get('type') === sighting.get('type')) {
      if (ts.get('pending') === undefined) {
        return sighting
      } else {
        const newPending = ts.get('pending').deleteAll(attribute.keys())
        if (newPending.size == 0) {
          return sighting
        } else {
          const newSighting = sighting.set('pending', newPending)
          return ts.get('localTargetId') === undefined ?
            newSighting :
            newSighting.set('localTargetId', ts.get('localTargetId'))
        }
      }
    }
    return ts
  }))
}

function failUpdateTargetSighting(state, sighting, attribute) {
  return state.update('saved', l => l.map(ts => {
    if (ts.get('id') === sighting.get('id') && ts.get('type') === sighting.get('type')) {
      if (ts.get('pending') === undefined) {
        return ts
      } else {
        const newPending = ts.get('pending').deleteAll(attribute.keys())
        if (newPending.size == 0) {
          return ts.delete('pending')
        } else {
          return ts.set('pending', newPending)
        }
      }
    }
    return ts
  }))
}

function addTargetSightingsFromServer(state, sightings) {
  const savedById = _.keyBy(state.get('saved').toJS(), 'id')
  return state.set(
    'saved',
    sightings.map(ts => {
      if (_.isObject(savedById[ts.get('id')])) {
        const savedTs = fromJS(savedById[ts.get('id')])
        ts = savedTs.get('pending') !== undefined ? ts.set('pending', savedTs.get('pending')) : ts
        ts = savedTs.get('localTargetId') !== undefined ? ts.set('localTargetId', savedTs.get('localTargetId')) : ts
      }
      return ts
    })
  )
}

export default targetSightingReducer
