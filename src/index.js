import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import $ from 'jquery'

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from './reducers'

import App from './App.js'
import Login from './pages/login/login.js'
import Tag from './pages/tag/tag.js'
import Logs from './pages/logs/logs.js'

import AuthUtil from './util/authUtil.js'
import {GROUND_SERVER_URL} from './constants/links.js'
import {AUTH_TOKEN_ID} from './constants/constants.js'

const store = createStore(rootReducer)

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
    jqXHR.setRequestHeader(
      'X-AUTH-TOKEN',
      localStorage.getItem(AUTH_TOKEN_ID)
    )
  }
})

var requireAuth = Class => {
  if (AuthUtil.authenticated()) {
    return <App main={Class} />
  } else {
    return <Redirect to="/login"/>
  }
}

const GroundServerRouter = () =>
  (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" render={() => <App main={<Login/>}/>}/>
          <Route path="/tag" render={() => requireAuth(<Tag/>)}/>
          <Route path="/logs" render={() => requireAuth(<Logs/>)}/>
          <Redirect from="*" to="/login"/>
        </Switch>
      </BrowserRouter>
    </Provider>
  )

ReactDOM.render(<GroundServerRouter />, document.getElementById('root'))
