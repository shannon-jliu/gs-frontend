import { combineReducers } from 'redux'

// import other reducers here
import imageReducer from './imageReducer.js'
import assignmentReducer from './assignmentReducer.js'

export default combineReducers({
  imageReducer,
  assignmentReducer,
})
