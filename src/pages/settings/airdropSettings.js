import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fromJS, Map } from 'immutable'

import airdropReducer from '../../reducers/airdropReducer.js'
import airdropOperations from '../../operations/airdropOperations.js'

import Switch from './components/Switch.js'
import TextField from './components/TextField.js'

export class AirdropSettings extends Component {
  constructor(props){
    super(props)
    this.state = {
      isArmed: false,
      commandDropNow: false,
      gpsTargetLocation: {
        latitude: 0,
        longitude: 0
      },
      acceptableThresholdFt: 0
    }

    /* Airdrop functions */
    this.getSavedFields = this.getSavedFields.bind(this)
    this.getDisplayFields = this.getDisplayFields.bind(this)
    this.getNewFields = this.getNewFields.bind(this)
    this.canSave = this.canSave.bind(this)
    this.save = this.save.bind(this)
    this.drop = this.drop.bind(this)
    this.updateSettingsOnInputChange = this.updateSettingsOnInputChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props) && (
      this.props.settings.get('settings').get('isArmed') !== this.state.isArmed &&
      this.props.settings.get('settings').get('commandDropNow') !== this.state.commandDropNow &&
      this.props.settings.get('settings').get('gpsTargetLocation').get('latitude') !== this.state.gpsTargetLocation.latitude &&
      this.props.settings.get('settings').get('gpsTargetLocation').get('longitude') !== this.state.gpsTargetLocation.longitude &&
      this.props.settings.get('settings').get('acceptableThresholdFt') !== this.state.acceptableThresholdFt
    )) {
      this.state.isArmed = this.props.settings.get('settings').get('isArmed')
      this.state.commandDropNow = this.props.settings.get('settings').get('commandDropNow')
      this.state.gpsTargetLocation.latitude = this.props.settings.get('settings').get('gpsTargetLocation').get('latitude')
      this.state.gpsTargetLocation.longitude = this.props.settings.get('settings').get('gpsTargetLocation').get('longitude')
      this.state.acceptableThresholdFt = this.props.settings.get('settings').get('acceptableThresholdFt')
    }
  }

  getSavedFields() {
    let newLocal = this.props.settings.get('settings')

    if (newLocal.get('isArmed') === undefined) {
      return {
        isArmed: null,
        commandDropNow: null,
        gpsTargetLocation: {
          latitude: null,
          longitude: null
        },
        acceptableThresholdFt: null
      }
    } else {
      return {
        isArmed: newLocal.get('isArmed'),
        commandDropNow: newLocal.get('commandDropNow'),
        gpsTargetLocation: {
          latitude: newLocal.get('gpsTargetLocation').get('latitude'),
          longitude: newLocal.get('gpsTargetLocation').get('latitude')
        },
        acceptableThresholdFt: newLocal.get('acceptableThresholdFt')
      }
    }
  }

  getDisplayFields() {
    return _.merge(this.getSavedFields(), this.state)
  }

  getNewFields() {
    let fields = this.getDisplayFields()
    if (_.isString(fields.gpsTargetLocation.latitude)) {
      fields.gpsTargetLocation.latitude = Number.parseFloat(
        fields.gpsTargetLocation.latitude
      )
    }

    if (_.isString(fields.gpsTargetLocation.longitude)) {
      fields.gpsTargetLocation.longitude = Number.parseFloat(
        fields.gpsTargetLocation.longitude
      )
    }

    if (_.isString(fields.acceptableThresholdFt)) {
      fields.acceptableThresholdFt = Number.parseInt(
        fields.acceptableThresholdFt
      )
    }
    return fields
  }

  canSave() {
    let newFields = this.getNewFields()
    let savedFields = this.getSavedFields()
    let lat = Number.parseFloat(newFields.gpsTargetLocation.latitude)
    let lon = Number.parseFloat(newFields.gpsTargetLocation.longitude)
    let threshold = Number.parseFloat(newFields.acceptableThresholdFt)
    let isValidSetting =
      !_.isNaN(lat) &&
      !_.isNaN(lon) &&
      !_.isNaN(threshold) &&
      (lat >= -90 && lat <= 90) &&
      (lon >= -180 && lon <= 180) &&
      threshold >= 0

    return (
      this.props.settings.get('pending').size == 0 &&
      !_.isEqual(newFields, savedFields) &&
      isValidSetting
    )
  }

  save() {
    if (this.canSave()) {
      let newFields = this.getNewFields()
      newFields.commandDropNow = false
      this.props.updateSettingsStart(newFields)

      this.setState({
        gpsTargetLocation: {
          latitude: 0,
          longitude: 0
        },
        acceptableThresholdFt: 0
      })
    }
  }

  drop() {
    if (
      (this.state.isArmed || this.props.settings.get('settings').get('isArmed')) &&
      this.props.settings.get('pending').isEmpty()
    ) {
      let saved = this.getSavedFields()
      saved.isArmed = true
      saved.commandDropNow = true
      saved.gpsTargetLocation.latitude = 0.0
      saved.gpsTargetLocation.longitude = 0.0
      saved.acceptableThresholdFt = 0.0
      this.props.updateSettingsStart(saved)
      this.setState({
        gpsTargetLocation: this.state.gpsTargetLocation,
        acceptableThresholdFt: this.state.acceptableThresholdFt
      })
    }
  }

  updateSettingsOnInputChange() {
    let newLocal = _.cloneDeep(this.state)
    // The following regex tests whether the input value is constructed solely of the numerical digits 0-9 or not
    if (this.latitudeInput.value === '' || this.latitudeInput.value.match(/^[-]?[\d]*\.?[\d]*$/)) newLocal.gpsTargetLocation.latitude = this.latitudeInput.value
    if (this.longitudeInput.value === '' || this.longitudeInput.value.match(/^[-]?[\d]*\.?[\d]*$/)) newLocal.gpsTargetLocation.longitude = this.longitudeInput.value
    if (this.thresholdInput.value === '' || !_.isNaN(Number.parseInt(this.thresholdInput.value))) newLocal.acceptableThresholdFt = this.thresholdInput.value
    newLocal.isArmed = this.isArmedInput.checked
    this.setState(newLocal)
  }
  
  render() {
    let display = this.getDisplayFields()

    let saveClass = !this.canSave() ? 'waves-effect waves-light btn grey' : 'waves-effect waves-light btn'

    let canDrop =
      !this.props.settings.get('settings').get('pending') &&
      display.isArmed &&
      !display.commandDropNow

    let dropClass = canDrop ? 'waves-effect waves-light btn blue' : 'waves-effect waves-light btn grey'

    return (
      <div className="airdrop">
        <div className="card white">
          <div className="card-content">
            <h3>Airdrop</h3>
            <div className="content">
              <h6>Target:</h6>
              <div className="row">
                <div>
                  <TextField myRef={ref => (this.latitudeInput = ref)}
                    onChange={this.updateSettingsOnInputChange}
                    value={display.gpsTargetLocation.latitude}
                    label={'Latitude'}
                  />
                </div>
                <div>
                  <TextField myRef={ref => (this.longitudeInput = ref)}
                    onChange={this.updateSettingsOnInputChange}
                    value={display.gpsTargetLocation.longitude}
                    label={'Longitude'}
                  />
                </div>
                <div>
                  <TextField myRef={ref => (this.thresholdInput = ref)}
                    onChange={this.updateSettingsOnInputChange}
                    value={display.acceptableThresholdFt}
                    label={'Threshold (Ft)'}
                  />
                </div>
              </div>
              <div className="row">
                <Switch offState={'Not ready'}
                  myRef={ref => (this.isArmedInput = ref)}
                  onChange={this.updateSettingsOnInputChange}
                  id={'ad-armed'}
                  checked={display.isArmed}
                  onState={'Ready'}
                />
                <br/>
                <div className="obj">
                  <button onClick={this.drop} className={dropClass}>
                    Drop
                  </button>
                </div>
                <br/>
                <div className="obj">
                  <button onClick={this.save} className={saveClass}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  settings: state.airdropReducer
})

const mapDispatchToProps = dispatch => ({
  updateSettingsStart: data => airdropOperations.updateSettingsStart(dispatch)(fromJS(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(AirdropSettings)
