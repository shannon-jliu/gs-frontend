import {fromJS} from 'immutable'

/**
 * Notes on state representation:
 * - all - (object) - mapping of image_id -> image objects. see API for image object
 * - lastIdPreloaded (int) - id of the most recently cached/preloaded image
 * - recent (object) - the most recent image received of server, otherwise timestamp of -1 is in the object if no recent img
*/
const initialState = fromJS({
  all: {},
  lastIdPreloaded: -1,
  recent: {
    timestamp: -1
  }
})

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'RECEIVE_IMAGE':
    var img = action.img
    // notice we are converting img.id to a String because JavaScript things -
    // as JavaScript Object keys are always Strings, see:
    // https://github.com/facebook/immutable-js/issues/282
    var all = state.setIn(['all', String(img.get('id'))], img)
    if (all.getIn(['recent', 'timestamp']) < img.get('timestamp')) {
      return all.set('recent', img)
    } else {
      return all
    }
  case 'PRELOAD_IMAGE':
    img = action.img
    if (img.get('id') > state.get('lastIdPreloaded')) {
      return state.set('lastIdPreloaded', img.get('id'))
    } else {
      return state
    }
  default:
    return state
  }
}

export default imageReducer
