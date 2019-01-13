import React from 'react'

import Header from './components/header.js'

const App = (props) => (
  <div>
    <Header />
    {
      props.main
    }
  </div>
)

export default App
