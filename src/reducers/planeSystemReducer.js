import {fromJS, Map} from 'immutable'

/*
 * Notes on state representation:
 * - image - (object) the current image from the plane system server.
*/

const initialState = fromJS({
  image: ''
})

const planeSystemReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'RECEIVE_PLANE_IMAGE':
    var image = action.image
    if (!state.get('image')) {
      return state.set('image', image)
    } else {
      return state
    }
  default:
    return state
  }
}

export default planeSystemReducer
