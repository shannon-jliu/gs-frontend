import { combineReducers } from 'redux'

// import other reducers here
import imageReducer from './imageReducer.js'
import assignmentReducer from './assignmentReducer.js'
import targetReducer from './targetReducer.js'
import targetSightingReducer from './targetSightingReducer.js'
import airdropReducer from './airdropReducer.js'
import cameraReducer from './cameraReducer.js'
import cameraGimbalReducer from './cameraGimbalReducer.js'
import gimbalSettingsReducer from './gimbalSettingsReducer.js'
/* Import the Fireworks reducer */
import fireworksReducer from './fireworksReducer.js'

/* Add the Fireworks reducer to the combined reducer */
export default combineReducers({
  imageReducer,
  targetSightingReducer,
  assignmentReducer,
  airdropReducer,
  targetReducer,
  cameraReducer,
  cameraGimbalReducer,
  gimbalSettingsReducer,
  fireworksReducer
})
