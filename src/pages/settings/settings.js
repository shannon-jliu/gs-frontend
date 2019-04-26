import React, { Component } from 'react'
import { connect } from 'react-redux'

import CameraSettings from './cameraSettings.js'
import CameraGimbalSettings from './cameraGimbalSettings.js'
import GimbalSettings from './gimbalSettings.js'
import AirdropSettings from './airdropSettings.js'

import cameraOperations from '../../operations/cameraOperations.js'
import cameraGimbalOperations from '../../operations/cameraGimbalOperations.js'
import gimbalSettingsOperations from '../../operations/gimbalSettingsOperations.js'
import airdropOperations from '../../operations/airdropOperations.js'

import './settings.css'

class Settings extends Component {
  componentDidMount() {
    window.addEventListener('load', () => {
      let loadNewestContent = () => {
        this.props.getCameraCapturing()
        this.props.getCameraZoom()
        this.props.getCameraGimbalSettings()
        this.props.getGimbalSettingSettings()
        this.props.getAirdropSettings()
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
          <CameraGimbalSettings/>
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
  getCameraGimbalSettings: data => cameraGimbalOperations.getSetting(dispatch),
  getGimbalSettingSettings: data => gimbalSettingsOperations.getSetting(dispatch),
  getAirdropSettings: data => airdropOperations.getSetting(dispatch)
})

export default connect(null, mapDispatchToProps)(Settings)
