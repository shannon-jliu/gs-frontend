import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fromJS, Map } from 'immutable'

import gimbalReducer from '../../reducers/gimbalReducer.js'
import gimbalOperations from '../../operations/gimbalOperations.js'

import Radio from './components/Radio.js'
import TextField from './components/TextField.js'

export class GimbalSettings extends Component {
  constructor(props){
    super(props)
    this.state = {
      mode: 0
    }

    /* Gimbal functions */
    this.getSavedFields = this.getSavedFields.bind(this)
    this.getDisplayFields = this.getDisplayFields.bind(this)
    this.getNewFields = this.getNewFields.bind(this)
    this.canSave = this.canSave.bind(this)
    this.save = this.save.bind(this)
    this.modeChange = this.modeChange.bind(this)
    this.updateSettingsOnInputChange = this.updateSettingsOnInputChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props && (prevProps.settings.get('settings').get('mode') === this.state.mode)) {
      this.state.mode = this.props.settings.get('settings').get('mode')
    }
  }

  getSavedFields() {
    let newLocal = this.props.settings.get('settings')
    
    if (typeof newLocal.get('mode') == 'undefined') {
      return {
        mode: null
      }
    } else {
      return {
        mode: newLocal.get('mode'),
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

    return (
      newFields.mode != undefined &&
      this.props.settings.get('pending').size == 0 &&
      !_.isEqual(newFields, savedFields)
    )
  }

  save() {
    if (this.canSave()) {
      let newFields = this.getNewFields()
      this.props.updateSettingsStart(newFields)

      this.setState({
        mode: 0
      })
    }
  }

  modeChange(e, newLocal) {
    if (e.target.type === 'radio') {
      let value = e.target.value
      if (value === 'retract') {
        newLocal.mode = 0
      } else if (value === 'fixed') {
        newLocal.mode = 1
      } else if (value === 'tracking') {
        newLocal.mode = 2
      }
    }
    return newLocal
  }

  updateSettingsOnInputChange(e) {
    let newLocal = _.cloneDeep(this.state)
    newLocal = this.modeChange(e, newLocal)

    this.setState(newLocal)
  }

  render() {
    let display = this.getDisplayFields()
    let retractSelected = display.mode === 0 ? true:false
    let groundSelected = display.mode === 1 ? true:false
    let trackingSelected = display.mode === 2 ? true:false

    let saveClass = !this.canSave() ? 'waves-light btn grey' : 'waves-light btn'

    let id='g-retract'

    return (
      <div className="gimbal">
        <div className="card white">
          <div className="card-content">
            <h3>Gimbal</h3>
            <div className="content">
              <h6>Mode:</h6>
              <div className="row">
                <Radio onChange={this.updateSettingsOnInputChange}
                  id={'g-retract'}
                  myRef={ref => (this.retractRadio = ref)}
                  value="retract"
                  checked={retractSelected}
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
  settings: state.gimbalReducer
})

const mapDispatchToProps = dispatch => ({
  updateSettingsStart: data => gimbalOperations.updateSettingsStart(dispatch)(fromJS(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(GimbalSettings)

