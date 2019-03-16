import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import _ from 'lodash'
import SnackbarUtil from './util/snackbarUtil.js'

import { GROUND_SERVER_URL } from './constants/links'
import { AUTH_TOKEN_ID } from './constants/constants'
import Header from './components/header.js'


export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 0
    }
  }

  listen(e) {
    this.state.mode = e.data
    SnackbarUtil.render('Camera-Gimbal mode has been changed')
  }

  componentWillMount() {
    var eventSourceInitDict = {headers: {'X-AUTH-TOKEN': localStorage.getItem(AUTH_TOKEN_ID)}}
    var eventSource = new EventSource(GROUND_SERVER_URL + '/api/v1/settings/camera_gimbal/stream', eventSourceInitDict)
    eventSource.addEventListener('message', this.listen, false)
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

export default App
