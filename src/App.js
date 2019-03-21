import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import _ from 'lodash'
import SnackbarUtil from './util/snackbarUtil.js'

import { GROUND_SERVER_URL } from './constants/links'
import { AUTH_TOKEN_ID } from './constants/constants'
import Header from './components/header.js'

import appOperations from './operations/appOperations.js'
import gimbalOperations from './operations/gimbalOperations.js'
import gimbalReducer from './reducers/gimbalReducer.js'

export class App extends Component {
  constructor(props) {
    super(props)
  }

  listen(e) {
    let mode = -1;
    let modeString = "";
    if (e.data === 'retract' || e.data === 'fixed') {
      mode = 0;
      modeString = 'Retract'
    } else if (e.data === 'idle') {
      mode = 1;
      modeString = 'Idle'
    } else if (e.data === 'tracking') {
      mode = 2;
      modeString = 'Tracking'
    }

    if (mode !== -1) {
        const modeObj = { timestamp : this.props.cameraGimbalSettings.get('settings').get('timestamp')+1, mode: mode }
        this.props.updateCameraGimbal(modeObj)
        SnackbarUtil.render('Camera-Gimbal mode has been changed to: ' + modeString)
    }
  }

  componentDidMount() {
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

const mapStateToProps = state => ({
  cameraGimbalSettings: state.gimbalReducer
})

const mapDispatchToProps = dispatch => ({
  updateCameraGimbal: data => appOperations.updateCameraGimbalSettingsLocal(dispatch)(data)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
