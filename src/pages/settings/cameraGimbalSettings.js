import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fromJS } from 'immutable'

import cameraGimbalOperations from '../../operations/cameraGimbalOperations.js'

import Radio from './components/Radio.js'
import Modes from './components/Modes.js'

export class CameraGimbalSettings extends Component {
  constructor(props){
    super(props)
    this.state = {
      mode: Modes.IDLE
    }

    /* Camera-Gimbal functions */
    this.getSavedFields = this.getSavedFields.bind(this)
    this.getDisplayFields = this.getDisplayFields.bind(this)
    this.getNewFields = this.getNewFields.bind(this)
    this.canSave = this.canSave.bind(this)
    this.save = this.save.bind(this)
    this.modeChange = this.modeChange.bind(this)
    this.updateSettingsOnInputChange = this.updateSettingsOnInputChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props) && (this.props.settings.get('settings').get('mode') !== this.state.mode)) {
      this.setState({ mode: this.props.settings.get('settings').get('mode') })
    }
  }

  getSavedFields() {
    let newLocal = this.props.settings.get('settings')

    if (newLocal.get('mode') === undefined) {
      return {
        mode: null
      }
    } else {
      return {
        mode: newLocal.get('mode')
      }
    }
  }

  getDisplayFields() {
    return _.merge(this.getSavedFields(), this.state)
  }

  getNewFields() {
    return this.getDisplayFields()
  }

  canSave() {
    let newFields = this.getNewFields()

    return (
      newFields.mode !== undefined &&
      this.props.settings.get('pending').size === 0
    )
  }

  save() {
    if (this.canSave()) {
      let newFields = this.getNewFields()
      this.props.updateSettingsStart(newFields)

      this.setState({
        mode: Modes.IDLE
      })
    }
  }

  modeChange(e, newLocal) {
    if (e.target.type === 'radio') {
      let value = e.target.value
      if (value === 'idle') {
        newLocal.mode = Modes.IDLE
      } else if (value === 'fixed') {
        newLocal.mode = Modes.FIXED
      } else if (value === 'tracking') {
        newLocal.mode = Modes.TRACKING
      }
    }

    this.props.changeCameraGimbalMode(newLocal.mode)
    return newLocal
  }

  updateSettingsOnInputChange(e) {
    let newLocal = _.cloneDeep(this.state)
    newLocal = this.modeChange(e, newLocal)

    this.setState(newLocal)
  }

  render() {
    let display = this.getDisplayFields()
    let idleSelected = display.mode === Modes.IDLE
    let groundSelected = display.mode === Modes.FIXED
    let trackingSelected = display.mode === Modes.TRACKING

    let saveClassInitial = 'waves-effect waves-light btn'
    let saveClass = saveClassInitial
    if (!this.canSave()) {
      saveClass += ' grey'
    } else {
      saveClass = saveClassInitial
    }

    return (
      <div className="gimbal">
        <div className="card white">
          <div className="card-content">
            <h3>Camera/Gimbal</h3>
            <div className="content">
              <h5>Mode:</h5>
              <div className="row">
                <Radio onChange={this.updateSettingsOnInputChange}
                  id={'g-idle'}
                  myRef={ref => (this.idleRadio = ref)}
                  value="idle"
                  checked={idleSelected}
                />
              </div>
              <div className="row">
                <Radio onChange={this.updateSettingsOnInputChange}
                  id={'g-ground'}
                  myRef={ref => (this.groundRadio = ref)}
                  value="fixed"
                  checked={groundSelected}
                />
              </div>
              <div className="row">
                <Radio onChange={this.updateSettingsOnInputChange}
                  id={'g-tracking'}
                  myRef={ref => (this.trackingRadio = ref)}
                  value="tracking"
                  checked={trackingSelected}
                />
              </div>
              <div className="row">
                <a onClick={this.save} className={saveClass} href='/#'>
                  Save
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  settings: state.cameraGimbalReducer
})

const mapDispatchToProps = dispatch => ({
  updateSettingsStart: data => cameraGimbalOperations.updateSettingsStart(dispatch)(fromJS(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraGimbalSettings)
