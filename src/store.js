import { createStore } from 'redux'
import { persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storageSession from 'redux-persist/lib/storage/session'

import rootReducer from './reducers'

const config = {
  transforms: [immutableTransform()], // required to convert localstorage to immutable
  key: 'root',
  storage: storageSession
}
const persistedReducer = persistReducer(config, rootReducer)
const store = createStore(persistedReducer)

export default store
