import React, { Component } from 'react'
import { connect } from 'react-redux'

import CameraSettings from './cameraSettings.js'
import CameraGimbalSettings from './cameraGimbalSettings.js'
import GimbalSettings from './gimbalSettings.js'

import cameraOperations from '../../operations/cameraOperations.js'
import cameraGimbalOperations from '../../operations/cameraGimbalOperations.js'
import gimbalSettingsOperations from '../../operations/gimbalSettingsOperations.js'
import assignmentOperations from '../../operations/assignmentOperations.js'

import Modes from './components/Modes.js'
import { TargetSightingGetRequests as GetRequests } from '../../util/receiveApi.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

import './settings.css'

export class Settings extends Component {
  constructor() {
    super()
    this.state = {
      cameraGimbalMode: Modes.IDLE
    }

    this.clearMdlc = this.clearMdlc.bind(this)
    this.downloadSightings = this.downloadSightings.bind(this)
    this.changeCameraGimbalMode = this.changeCameraGimbalMode.bind(this)
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      let loadNewestContent = () => {
        this.props.getCameraCapturing()
        this.props.getCameraZoom()
        this.props.getCameraGimbalSettings()
        this.props.getGimbalSettingSettings()
        setTimeout(loadNewestContent, 1000)
      }
      loadNewestContent()
    })
  }

  clearMdlc(e) {
    e.preventDefault()
    if (window.confirm('Are you sure you wish to clear the MDLC-related tables?')) {
      this.props.clearMdlc()
    }
  }

  downloadSightings(e) {
    e.preventDefault()
    const alphanumSuccess = data => {
      let filename = "target-annotations" + Date.now() + ".json";
      let contentType = "application/json;charset=utf-8;";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(data)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(data));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    }
    const alphanumFail = () => SnackbarUtil.render('Failed to download target sightings.')
    GetRequests.getAlphanumSightings(alphanumSuccess, alphanumFail)
  }

  changeCameraGimbalMode(newCameraGimbalMode) {
    this.setState({cameraGimbalMode: newCameraGimbalMode})
  }

  render() {
    return (
      <React.Fragment>
        <div id='containerContainer'>
          <div id='clearButtonContainer' className="row">
          <a onClick={this.downloadSightings} className='waves-effect waves-light btn green' href='/#'>
              Download Sightings
          </a>
          </div>
          <div id='clearButtonContainer' className="row">
            <a onClick={this.clearMdlc} className='waves-effect waves-light btn red' href='/#'>
              Clear MDLC
            </a>
          </div>
          <div id='container'>
            <CameraSettings/>
            <CameraGimbalSettings changeCameraGimbalMode={this.changeCameraGimbalMode}/>
            <GimbalSettings cameraGimbalMode={this.state.cameraGimbalMode}/>
          </div>
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
  clearMdlc: data => assignmentOperations.clearMdlc(dispatch)
})

export default connect(null, mapDispatchToProps)(Settings)
