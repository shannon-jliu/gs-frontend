import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import $ from 'jquery'

import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App.js'
import Login from './pages/login/login.js'
import Logout from './pages/logout/logout.js'
import Tag from './pages/tag/tag.js'
import Settings from './pages/settings/settings.js'
import Merge from './pages/merge/merge.js'
import Logs from './pages/logs/logs.js'

import store from './store.js'
import AuthUtil from './util/authUtil.js'
import { GROUND_SERVER_URL } from './constants/links.js'
import { AUTH_TOKEN_ID } from './constants/constants.js'

const persistor = persistStore(store)

$.ajaxSetup({
  dataType: 'json',
  contentType: 'application/json',
  processData: false,
  beforeSend: function (jqXHR, options) {
    if (
      options.contentType === 'application/json' &&
      typeof options.data !== 'string'
    ) {
      options.data = JSON.stringify(options.data)
    }
    options.url = GROUND_SERVER_URL + options.url
    if (localStorage.getItem(AUTH_TOKEN_ID)) {
      jqXHR.setRequestHeader(
        'Username',
        JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).username
      )
    }
  }
})

var requireAuth = Class => {
  if (AuthUtil.authenticated()) {
    return <App main={Class} />
  } else {
    return <Redirect to="/login" />
  }
}

// PersistGate required to delay until persistence complete
// see https://github.com/rt2zz/redux-persist#react-integration
const GroundServerRouter = () =>
(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" render={() => <App main={<Login />} />} />
          <Route path="/logout" render={() => requireAuth(<Logout />)} />
          <Route path="/tag" render={() => requireAuth(<Tag />)} />
          <Route path="/settings" render={() => requireAuth(<Settings />)} />
          <Route path="/merge" render={() => requireAuth(<Merge />)} />
          <Route path="/logs" render={() => requireAuth(<Logs />)} />
          <Redirect from="*" to="/login" />
        </Switch>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

ReactDOM.render(<GroundServerRouter />, document.getElementById('root'))
