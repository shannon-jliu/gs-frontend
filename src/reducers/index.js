import { combineReducers } from 'redux'

// import other reducers here
import imageReducer from './imageReducer.js'
import assignmentReducer from './assignmentReducer.js'
import targetReducer from './targetReducer.js'
import targetSightingReducer from './targetSightingReducer.js'
import cameraReducer from './cameraReducer.js'
import cameraGimbalReducer from './cameraGimbalReducer.js'
import gimbalSettingsReducer from './gimbalSettingsReducer.js'
import fiveTargetsReducer from './fiveTargetsReducer.js'
import utilReducer from './utilReducer.js'

export default combineReducers({
  imageReducer,
  targetSightingReducer,
  assignmentReducer,
  targetReducer,
  cameraReducer,
  cameraGimbalReducer,
  gimbalSettingsReducer,
  fiveTargetsReducer,
  utilReducer
})
