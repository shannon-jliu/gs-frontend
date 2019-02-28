import { combineReducers } from 'redux'

// import other reducers here
import imageReducer from './imageReducer.js'
import assignmentReducer from './assignmentReducer.js'
import targetReducer from './targetReducer.js'
import targetSightingReducer from './targetSightingReducer.js'
import airdropReducer from './airdropReducer.js'
import cameraReducer from './cameraReducer.js'
import gimbalReducer from './gimbalReducer.js'

export default combineReducers({
  imageReducer,
  targetSightingReducer,
  assignmentReducer,
  airdropReducer,
  targetReducer,
  cameraReducer,
  gimbalReducer
})
