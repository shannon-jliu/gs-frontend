import React, { Component } from 'react'
import { connect } from 'react-redux'

import CameraSettings from './cameraSettings.js'
import GimbalSettings from './gimbalSettings.js'
import AirdropSettings from './airdropSettings.js'

import cameraOperations from '../../operations/cameraOperations.js'
import gimbalOperations from '../../operations/gimbalOperations.js'
import airdropOperations from '../../operations/airdropOperations.js'

import './settings.css'

class Settings extends Component {
  componentDidMount() {
    window.addEventListener('load', () => {
      var loadNewestContent = () => {
        // this.props.getCameraCapturing()
        // this.props.getCameraZoom()
        // this.props.getGimbalSettings()
        // this.props.getAirdropSettings()
        setTimeout(loadNewestContent, 1000)
      }
      loadNewestContent()
    })
  }

  render() {
    return (
      <React.Fragment>
        <div id='container'>
          <CameraSettings/>
          <GimbalSettings/>
          <AirdropSettings/>
        </div>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getCameraCapturing: data => cameraOperations.getCapturing(dispatch),
  getCameraZoom: data => cameraOperations.getZoom(dispatch),
  getGimbalSettings: data => gimbalOperations.getSetting(dispatch),
  getAirdropSettings: data => airdropOperations.getSetting(dispatch)
})

export default connect(null, mapDispatchToProps)(Settings)
