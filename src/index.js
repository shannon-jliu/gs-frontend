import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom'

import App from './App.js'

const GroundServerRouter = () =>
(
  <BrowserRouter>
    <Route path="" component={App}>
    </Route>
  </BrowserRouter>
)

ReactDOM.render(<GroundServerRouter />, document.getElementById('root'));
