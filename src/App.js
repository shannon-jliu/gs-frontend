import React from 'react'

import Header from './components/header.js'

const App = (props) => (
  <div>
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header is-small-screen is-upgraded">
      <Header currentPage={props.currentPage} />
      {
        props.main
      }
    </div>
  </div>
)

export default App
