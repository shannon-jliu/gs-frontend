import { combineReducers } from 'redux'

// import other reducers here
import imageReducer from './imageReducer.js'
import gimbalReducer from './gimbalReducer.js'
import assignmentReducer from './assignmentReducer.js'
import targetReducer from './targetReducer.js'
import targetSightingReducer from './targetSightingReducer.js'
import airdropReducer from './airdropReducer.js'

export default combineReducers({
  imageReducer,
  targetSightingReducer,
  gimbalReducer,
  assignmentReducer,
  airdropReducer,
  targetReducer,
})
