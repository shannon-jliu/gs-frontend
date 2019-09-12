import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fromJS, Map } from 'immutable'

import gimbalSettingsReducer from '../../reducers/gimbalSettingsReducer.js'
import gimbalSettingsOperations from '../../operations/gimbalSettingsOperations.js'

import Radio from './components/Radio.js'
import TextField from './components/TextField.js'

import Modes from './components/Modes.js'

export class GimbalSettings extends Component {
  constructor(props){
    super(props)
    this.state = {
      gps: {
        latitude: 0,
        longitude: 0
      },
      orientation: {
        roll: 0,
        pitch: 0
      }
    }

    /* Gimbal functions */
    this.getSavedFields = this.getSavedFields.bind(this)
    this.getDisplayFields = this.getDisplayFields.bind(this)
    this.getNewFields = this.getNewFields.bind(this)
    this.canSave = this.canSave.bind(this)
    this.save = this.save.bind(this)
    this.updateSettingsOnInputChange = this.updateSettingsOnInputChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settings.get('settings').get('gps') !== undefined &&
      prevProps.settings.get('settings').get('orientation') !== undefined) {
      if (!_.isEqual(prevProps, this.props) && (
        this.props.settings.get('settings').get('gps').get('latitude') !== this.state.gps.latitude &&
          this.props.settings.get('settings').get('gps').get('longitude') !== this.state.gps.longitude &&
          this.props.settings.get('settings').get('orientation').get('roll') !== this.state.orientation.roll &&
          this.props.settings.get('settings').get('orientation').get('pitch') !== this.state.orientation.pitch
      )) {
        this.state.gps.latitude = this.props.settings.get('settings').get('gps').get('latitude')
        this.state.gps.longitude = this.props.settings.get('settings').get('gps').get('longitude')
        this.state.orientation.roll = this.props.settings.get('settings').get('orientation').get('roll')
        this.state.orientation.pitch = this.props.settings.get('settings').get('orientation').get('pitch')
      }
    }
  }

  getSavedFields() {
    let newLocal = this.props.settings.get('settings')

    if (newLocal.get('gps') === undefined ||
        newLocal.get('orientation') === undefined) {
      return {
        gps: { latitude: null, longitude: null },
        orientation: { roll: null, pitch: null }
      }
    } else {
      let latitude = newLocal.get('gps').get('latitude') == null ? 0 : newLocal.get('gps').get('latitude')
      let longitude = newLocal.get('gps').get('longitude') == null ? 0 : newLocal.get('gps').get('longitude')
      let roll = newLocal.get('orientation').get('roll') == null ? 0 : newLocal.get('orientation').get('roll')
      let pitch = newLocal.get('orientation').get('pitch') == null ? 0 : newLocal.get('orientation').get('pitch')
      return {
        gps: { latitude: latitude, longitude: longitude },
        orientation: { roll: roll, pitch: pitch }
      }
    }
  }

  getDisplayFields() {
    return _.merge(this.getSavedFields(), this.state)
  }

  getNewFields() {
    let fields = this.getDisplayFields()
    return fields
  }

  canSave() {
    let newFields = this.getNewFields()
    let savedFields = this.getSavedFields()

    let isValidInput = true
    if (this.props.cameraGimbalMode === Modes.FIXED) {
      let lat = newFields.gps.latitude
      let lon = newFields.gps.longitude
      isValidInput =
        !_.isNaN(lat) &&
        !_.isNaN(lon) &&
        lat !== '' &&
        lon !== '' &&
        (lat >= -90 && lat <= 90) &&
        (lon >= -180 && lon <= 180)
    } else if (this.props.cameraGimbalMode === Modes.TRACKING) {
      let roll = newFields.orientation.roll
      let pitch = newFields.orientation.pitch
      isValidInput =
        !_.isNaN(roll) &&
        !_.isNaN(pitch) &&
        roll !== '' &&
        pitch !== '' &&
        (roll >= 0 && roll <= 360) &&
        (pitch >= 0 && pitch <= 360)
    }

    return (
      this.props.cameraGimbalMode != Modes.UNDEFINED &&
      this.props.settings.get('pending').size == 0 &&
      !_.isEqual(newFields, savedFields) &&
      isValidInput
    )
  }

  save() {
    if (this.canSave()) {
      let newFields = this.getNewFields()
      this.props.updateSettingsStart(newFields)

      this.setState({
        gps: {
          latitude: 0,
          longitude: 0
        },
        orientation: {
          roll: 0,
          pitch: 0
        }
      })
    }
  }

  updateSettingsOnInputChange(e) {
    let newLocal = _.cloneDeep(this.state)
    // This regex ensures that the input is a float. "Float" in this context also encompasses integers.
    let val = e.target.value.match(/^[-]?[\d]*\.?[\d]*$/)
    if (val === null) {
      val = ''
    } else {
      val = parseFloat(val[0])
      val = isNaN(val) ? '' : val
    }
    if (e.target.id === 'Latitude') {
      newLocal.gps.latitude = val
    } else if (e.target.id === 'Longitude') {
      newLocal.gps.longitude = val
    } else if (e.target.id === 'Roll') {
      newLocal.orientation.roll = val
    } else if (e.target.id === 'Pitch') {
      newLocal.orientation.pitch = val
    }

    this.setState(newLocal)
  }

  render() {
    let styleGPS = this.props.cameraGimbalMode === Modes.TRACKING ? {display: 'none'} : {}
    let styleAngle = this.props.cameraGimbalMode === Modes.FIXED ? {display: 'none'} : {}

    let saveClass = !this.canSave() ? 'waves-effect waves-light btn grey' : 'waves-effect waves-light btn'

    return (
      <div className="gimbal">
        <div className="card white">
          <div className="card-content">
            <h3>Gimbal Settings</h3>
            <div className="content">
              <h5>Point to:</h5>
              <div className="row" id="gpsRow" style={styleGPS}>
                <h6>GPS</h6>
                <div>
                  <TextField myRef={ref => (this.latitudeInput = ref)}
                    onChange={this.updateSettingsOnInputChange}
                    value={this.state.gps.latitude}
                    label={'Latitude'}
                  />
                </div>
                <div>
                  <TextField myRef={ref => (this.longitudeInput = ref)}
                    onChange={this.updateSettingsOnInputChange}
                    value={this.state.gps.longitude}
                    label={'Longitude'}
                  />
                </div>
              </div>
              <div className="row" id="angleRow" style={styleAngle}>
                <h6>Angle</h6>
                <div>
                  <TextField myRef={ref => (this.rollInput = ref)}
                    onChange={this.updateSettingsOnInputChange}
                    value={this.state.orientation.roll}
                    label={'Roll'}
                  />
                </div>
                <div>
                  <TextField myRef={ref => (this.pitchInput = ref)}
                    onChange={this.updateSettingsOnInputChange}
                    value={this.state.orientation.pitch}
                    label={'Pitch'}
                  />
                </div>
              </div>
              <div className="row">
                <a onClick={this.save} className={saveClass}>
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
  settings: state.gimbalSettingsReducer
})

const mapDispatchToProps = dispatch => ({
  updateSettingsStart: data => gimbalSettingsOperations.updateSettingsStart(dispatch)(fromJS(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(GimbalSettings)
