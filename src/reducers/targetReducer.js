import { fromJS } from 'immutable'
import _ from 'lodash'

/**
 * Notes on state representation:
 * - local is the list of unsaved (locally created, not yet saved on backend) targets.
 * - saved is the list of targets saved on the backend
 * - local targets have a string localId parameter
 * - saved targets have an int id parameter. These are assigned by the backend and will overlap for different target types
 * - the pending field in a target is set iff some part of the target is saving
 *   - if the target is being created on the backend (and is currently local), it is empty
 *   - if specific attributes are being updated, those attributes are all stored in pending
 */
const initialState = fromJS({
  local: [],
  saved: [],
  thumbId: -1,
})

const targetReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'ADD_TARGET':
    return addTarget(state, action.target)
  case 'DELETE_TARGET':
    return deleteTarget(state, action.target)
  case 'START_SAVE_TARGET':
    return startSaveTarget(state, action.localId)
  case 'SUCCEED_SAVE_TARGET':
    return succeedSaveTarget(state, action.target, action.localId)
  case 'FAIL_SAVE_TARGET':
    return failSaveTarget(state, action.localId)
  case 'START_UPDATE_TARGET':
    return startUpdateTarget(state, action.target, action.attribute)
  case 'SUCCEED_UPDATE_TARGET':
    return succeedUpdateTarget(state, action.target, action.attribute)
  case 'FAIL_UPDATE_TARGET':
    return failUpdateTarget(state, action.target, action.attribute)
  case 'ADD_TARGETS_FROM_SERVER':
    return addTargetsFromServer(state, action.targets)
  case 'CLEAR_STATE':
    return initialState
  case 'UPDATE_SELECTED_THUM':
    // do something here to store..
    return state.set('thumbId', action.thumbId)
  default:
    return state
  }
}

function addTarget(state, target) {
  return state.update('local', (l) => l.push(target))
}

function deleteTarget(state, target) {
  if (_.isString(target.get('localId'))) {
    return state.update('local', (l) =>
      //don't need to check type because localIds don't overlap for diff types
      l.filter((tgt) => tgt.get('localId') !== target.get('localId'))
    )
  } else {
    return state.update('saved', (l) =>
      l.filter(
        (tgt) =>
          tgt.get('id') !== target.get('id') ||
          tgt.get('type') !== target.get('type')
      )
    )
  }
}

function startSaveTarget(state, localId) {
  return state.update('local', (l) =>
    l.map((tgt) =>
      tgt.get('localId') === localId ? tgt.set('pending', fromJS({})) : tgt
    )
  )
}

function succeedSaveTarget(state, target, localId) {
  return state
    .update('local', (l) => l.filter((tgt) => tgt.get('localId') !== localId))
    .update('saved', (s) => s.push(target))
}

function failSaveTarget(state, localId) {
  return state.update('local', (l) =>
    l.map((tgt) =>
      tgt.get('localId') === localId ? tgt.delete('pending') : tgt
    )
  )
}

function startUpdateTarget(state, target, attribute) {
  return state.update('saved', (s) =>
    s.map((tgt) => {
      if (
        tgt.get('id') === target.get('id') &&
        tgt.get('type') === target.get('type')
      ) {
        if (tgt.get('pending') === undefined) {
          return tgt.set('pending', attribute)
        } else {
          //overwrite is fine because save should never be called for attribute currently pending save
          return tgt.set('pending', tgt.get('pending').merge(attribute))
        }
      }
      return tgt
    })
  )
}

function succeedUpdateTarget(state, target, attribute) {
  return state.update('saved', (s) =>
    s.map((tgt) => {
      if (
        tgt.get('id') === target.get('id') &&
        tgt.get('type') === target.get('type')
      ) {
        if (tgt.get('pending') !== undefined) {
          const newPending = tgt.get('pending').deleteAll(attribute.keys())
          return newPending.size === 0
            ? target.delete('pending')
            : target.set('pending', newPending)
        }
        return target
      }
      return tgt
    })
  )
}

function failUpdateTarget(state, target, attribute) {
  return state.update('saved', (s) =>
    s.map((tgt) => {
      if (
        tgt.get('id') === target.get('id') &&
        tgt.get('type') === target.get('type')
      ) {
        if (tgt.get('pending') !== undefined) {
          const newPending = tgt.get('pending').deleteAll(attribute.keys())
          return newPending.size === 0
            ? tgt.delete('pending')
            : tgt.set('pending', newPending)
        }
      }
      return tgt
    })
  )
}

function addTargetsFromServer(state, targets) {
  const savedById = _.keyBy(
    state.get('saved').toJSON(),
    (o) => o.get('id') + ':' + o.get('type')
  )
  return state.set(
    'saved',
    targets.map((tgt) => {
      if (_.isObject(savedById[tgt.get('id') + ':' + tgt.get('type')])) {
        const savedTgt = savedById[tgt.get('id') + ':' + tgt.get('type')]
        return savedTgt.get('pending') !== undefined
          ? tgt.set('pending', savedTgt.get('pending'))
          : tgt
      } else {
        return tgt
      }
    })
  )
}

export default targetReducer
