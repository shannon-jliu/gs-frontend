import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import _ from 'lodash'
import SnackbarUtil from './util/snackbarUtil.js'

import { GROUND_SERVER_URL } from './constants/links'
import { AUTH_TOKEN_ID } from './constants/constants'
import Header from './components/header.js'

import gimbalOperations from './operations/gimbalOperations.js'

export class App extends Component {
  constructor(props) {
    super(props)
  }

  listen(e) {
    let mode = -1;
    if (e.data.localeCompare('retract')) {
      mode = 0;
    } else if (e.data.localeCompare('idle')) {
      mode = 1;
    } else if (e.data.localeCompare('tracking')) {
      mode = 2;
    }
    // this.props.updateCameraGimbal(mode)
    let modeObj = { mode: mode }
    gimbalOperations.updateSettingsStart(modeObj)
    // console.log(gimbalOperations)
    SnackbarUtil.render('Camera-Gimbal mode has been changed')
  }

  componentWillMount() {
    let eventSourceInitDict = {headers: {'X-AUTH-TOKEN': localStorage.getItem(AUTH_TOKEN_ID)}}
    let eventSource = new EventSource(GROUND_SERVER_URL + '/api/v1/settings/camera_gimbal/stream', eventSourceInitDict)
    let boundListen = this.listen.bind(this)
    eventSource.addEventListener('message', boundListen, false)
  }

  render() {
    return (
      <div>
        <Header />
        {
          this.props.main
        }
      </div>
    )
  }
}

// const mapDispatchToProps = dispatch => ({
//   updateCameraGimbal: data => gimbalOperations.updateSettingsStart(dispatch),
// })

// export default connect(null, mapDispatchToProps)(App)

// export App

export default App

