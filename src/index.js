import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from './reducers'

import App from './App.js'

const store = createStore(rootReducer)

const GroundServerRouter = () =>
(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="" component={App}>
      </Route>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(<GroundServerRouter />, document.getElementById('root'));
