import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fromJS, Map } from 'immutable'

import cameraReducer from '../../reducers/cameraReducer.js'
import cameraOperations from '../../operations/cameraOperations.js'

import Switch from './components/Switch.js'
import Radio from './components/Radio.js'

export class CameraSettings extends Component {
  constructor(props){
    super(props)
    this.state = {
      capturing: false,
      zoom: 0
    }

    /* Camera functions */
    this.getSavedFields = this.getSavedFields.bind(this)
    this.getDisplayFields = this.getDisplayFields.bind(this)
    this.getNewFields = this.getNewFields.bind(this)
    this.canSave = this.canSave.bind(this)
    this.save = this.save.bind(this)
    this.capturingChange = this.capturingChange.bind(this)
    this.zoomChange = this.zoomChange.bind(this)
    this.updateSettingsOnInputChange = this.updateSettingsOnInputChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props) && (
      this.props.settings.get('settings').get('capturing') !== this.state.capturing &&
      this.props.settings.get('settings').get('zoom') !== this.state.zoom
    )) {
      this.state.capturing = this.props.settings.get('settings').get('capturing')
      this.state.zoom = this.props.settings.get('settings').get('zoom')
    }
  }

  getSavedFields() {
    let newLocal = this.props.settings.get('settings')
    
    if (newLocal.get('capturing') === undefined) {
      return {
        capturing: null,
        zoom: null
      }
    } else {
      return {
        capturing: newLocal.get('capturing'),
        zoom: newLocal.get('zoom')
      }
    }
  }

  getDisplayFields() {
    return _.merge(this.getSavedFields(), this.state)
  }

  getNewFields() {
    let fields = this.getDisplayFields()
    if (_.isString(fields.zoom)) fields.zoom = Number.parseInt(fields.zoom)

    return fields
  }

  canSave() {
    let newFields = this.getNewFields()
    let savedFields = this.getSavedFields()
    let zoom = Number.parseInt(newFields.zoom)
    let isValidSetting =
      !_.isNaN(zoom) &&
      (zoom >= 0 && zoom <= 2)

    return (
      this.props.settings.get('pending').size == 0 &&  
      !_.isEqual(newFields, savedFields) &&
      isValidSetting
    )
  }

  save() {
    if (this.canSave()) {
      let newFields = this.getNewFields()
      this.props.updateSettingsStart(newFields)

      this.setState({
        capturing: false,
        zoom: 0
      })
    }
  }

  capturingChange(val, newLocal) {
    newLocal.capturing = val
    return newLocal
  }

  zoomChange(e, newLocal) {
    if (e.target.type === 'radio') newLocal.zoom = e.target.value === 'min_zoom' ? 0:1
    return newLocal
  }

  updateSettingsOnInputChange(e) {
    let newLocal = _.cloneDeep(this.state)
    newLocal = this.capturingChange(this.capturingInput.checked, newLocal)
    newLocal = this.zoomChange(e, newLocal)

    this.setState(newLocal)
  }
  
  render() {
    let display = this.getDisplayFields()
    let min_zoomSelected = display.zoom === 0 ? true:false
    let max_zoomSelected = display.zoom === 1 ? true:false

    let saveClass = !this.canSave() ? 'waves-light btn grey' : 'waves-light btn'

    return (
      <div className="camera">
        <div className="card white">
          <div className="card-content">
            <h3>Camera</h3>
            <div className="content">
              <div className="row">
                <Switch offState={'Not capturing'}
                  myRef={ref => (this.capturingInput = ref)}
                  onChange={this.updateSettingsOnInputChange}
                  id={'capturing'}
                  checked={display.capturing}
                  onState={'Capturing'}
                />
              </div>
              <br/>
              <h6>Zoom:</h6>
              <div className="row">
                <Radio onChange={this.updateSettingsOnInputChange}
                  id={'g-minZoom'}
                  myRef={ref => (this.min_zoomRadio = ref)}
                  value="min_zoom"
                  checked={min_zoomSelected}
                />
              </div>
              <div className="row">
                <Radio onChange={this.updateSettingsOnInputChange}
                  id={'g-maxZoom'}
                  myRef={ref => (this.max_zoomRadio = ref)}
                  value="max_zoom"
                  checked={max_zoomSelected}
                />
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
    )
  }
}

const mapStateToProps = state => ({
  settings: state.cameraReducer
})

const mapDispatchToProps = dispatch => ({
  updateSettingsStart: data => cameraOperations.updateSettingsStart(dispatch)(fromJS(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraSettings)
