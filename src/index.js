import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import $ from 'jquery'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import immutableTransform from 'redux-persist-transform-immutable'
import storageSession from 'redux-persist/lib/storage/session'

import rootReducer from './reducers'

import App from './App.js'
import Login from './pages/login/login.js'
import Tag from './pages/tag/tag.js'
import Settings from './pages/settings/settings.js'
import Merge from './pages/merge/merge.js'
import Logs from './pages/logs/logs.js'
/* Import the main Fireworks js file */
import Fireworks from './pages/fireworks/fireworks.js'

import {GROUND_SERVER_URL} from './constants/links.js'

const config = {
  transforms: [immutableTransform()], // required to convert localstorage to immutable
  key: 'root',
  storage: storageSession
}
const persistedReducer = persistReducer(config, rootReducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)

$.ajaxSetup({
  dataType: 'json',
  contentType: 'application/json',
  processData: false,
  beforeSend: function(jqXHR, options) {
    if (
      options.contentType === 'application/json' &&
      typeof options.data !== 'string'
    ) {
      options.data = JSON.stringify(options.data)
    }
    options.url = GROUND_SERVER_URL + options.url
  }
})


// TODO: Fix /Fireworks vs /fireworks issue, maybe search in commit history/diffs for /Fireworks and see where in code that is

// PersistGate required to delay until persistence complete
// see https://github.com/rt2zz/redux-persist#react-integration
/* Add Route for the Fireworks page */
const GroundServerRouter = () =>
  (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Switch>
            <Route path="/login" render={() => <App main={<Login/>}/>}/>
            <Route path="/tag" render={() => <App main={<Tag/>}/>}/>
            <Route path="/settings" render={() => <App main={<Settings/>}/>}/>
            <Route path="/fireworks" render={() => <App main={<Fireworks/>}/>}/>
            <Route path="/merge" render={() => <App main={<Merge/>}/>}/>
            <Route path="/logs" render={() => <App main={<Logs/>}/>}/>
            <Redirect from="*" to="/login"/>
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )

ReactDOM.render(<GroundServerRouter />, document.getElementById('root'))
