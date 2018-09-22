import {fromJS} from 'immutable'

const initialState = fromJS({
  all: {},
  recent: {
    timestamp: 0
  }
})

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_IMAGE':
      const img = action.img
      // notice we are converting img.id to a String because JavaScript things -
      // as JavaScript Object keys are always Strings, see:
      // https://github.com/facebook/immutable-js/issues/282
      const all = state.setIn(["all", String(img.id)], fromJS(img));
      if (all.getIn(["recent", "timestamp"]) < img.timestamp) {
        return all.set("recent", fromJS(img));
      } else {
        return all;
      }
    default:
      return state
  }
}

export default imageReducer
