import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fromJS } from 'immutable'

import fireworksReducer from '../../reducers/fireworksReducer.js'
import fireworksOperations from '../../operations/fireworksOperations.js'

import { GET_SETTINGS } from '../../util/config.js'

import Radio from './components/Radio.js'
import TextField from './components/TextField.js'

import './fireworks.css'

export class Fireworks extends Component {
  constructor(props){
    super(props)
    this.state = {
      color: 'red',
      number: 0
    }

    /* Camera-Gimbal functions */
    this.getSavedFields = this.getSavedFields.bind(this)
    this.getDisplayFields = this.getDisplayFields.bind(this)
    this.getNewFields = this.getNewFields.bind(this)
    this.canSave = this.canSave.bind(this)
    this.save = this.save.bind(this)
    this.colorChange = this.colorChange.bind(this)
    this.numberChange = this.numberChange.bind(this)
  }

  componentDidMount() {
    if (GET_SETTINGS) {
      window.addEventListener('load', () => {
        let loadNewestContent = () => {
          this.props.getFireworksColor()
          this.props.getFireworksNumber()
          setTimeout(loadNewestContent, 1000)
        }
        loadNewestContent()
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props) && (
      this.props.settings.get('settings').get('color') !== this.state.color &&
      this.props.settings.get('settings').get('number') !== this.state.number
    )) {
      this.state.color = this.props.settings.get('settings').get('color')
      this.state.number = this.props.settings.get('settings').get('number')
    }
  }

  getSavedFields() {
    let newLocal = this.props.settings.get('settings')

    if (newLocal.get('color') === undefined) {
      return {
        color: null,
        number: null
      }
    } else {
      return {
        color: newLocal.get('color'),
        number: newLocal.get('number')
      }
    }
  }

  getDisplayFields() {
    return _.merge(this.getSavedFields(), this.state)
  }

  getNewFields() {
    let fields = this.getDisplayFields()
    if (_.isString(fields.number)) fields.zoom = Number.parseInt(fields.number)

    return fields
  }

  canSave() {
    let newFields = this.getNewFields()
    let savedFields = this.getSavedFields()
    let number = Number.parseInt(newFields.number)
    let isValidSetting = !_.isNaN(number)

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
        color: 'red',
        number: 0
      })
    }
  }

  colorChange(e) {
    let newLocal = _.cloneDeep(this.state)

    if (e.target.type === 'radio') {
      let value = e.target.value
      if (value === 'red') {
        newLocal.color = 'red'
      } else if (value === 'green') {
        newLocal.color = 'green'
      } else if (value === 'blue') {
        newLocal.color = 'blue'
      }
    }

    this.setState(newLocal)
  }

  numberChange(e) {
    let newLocal = _.cloneDeep(this.state)
    let val = e.target.value.match(/^[-]?[\d]*\.?[\d]*$/)

    if (val === null) {
      val = ''
    } else {
      val = parseFloat(val[0])
      val = isNaN(val) ? '' : val
    }

    newLocal.color = val

    this.setState(newLocal)
  }

  render() {
    let display = this.getDisplayFields()
    let redSelected = display.color === 'red'
    let greenSelected = display.color === 'green'
    let blueSelected = display.color === 'blue'

    let saveClassInitial = 'waves-effect waves-light btn'
    let saveClass = saveClassInitial
    if (!this.canSave()) {
      saveClass += ' grey'
    } else {
      saveClass = saveClassInitial
    }

    return (
      <div className="fireworks">
        <div className="card white">
          <div className="card-content">
            <h3>Fireworks</h3>
            <div className="content">
              <h6>Color:</h6>
              <div className="row">
                <Radio onChange={this.colorChange}
                  id={'g-red'}
                  myRef={ref => (this.redRadio = ref)}
                  value="red"
                  checked={redSelected}
                />
              </div>
              <div className="row">
                <Radio onChange={this.colorChange}
                  id={'g-green'}
                  myRef={ref => (this.greenRadio = ref)}
                  value="green"
                  checked={greenSelected}
                />
              </div>
              <div className="row">
                <Radio onChange={this.colorChange}
                  id={'g-blue'}
                  myRef={ref => (this.blueRadio = ref)}
                  value="blue"
                  checked={blueSelected}
                />
              </div>
            </div>
            <br/>
            <div className="content">
              <h6>Number:</h6>
              <div className="row">
                <TextField myRef={ref => (this.numberInput = ref)}
                  onChange={this.numberChange}
                  value={this.state.number}
                  label={'Number'}
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
    )
  }
}

const mapStateToProps = state => ({
  settings: state.fireworksReducer
})

const mapDispatchToProps = dispatch => ({
  updateSettingsStart: data => fireworksOperations.updateSettingsStart(dispatch)(fromJS(data)),
  getFireworksColor: data => fireworksOperations.getColor(dispatch),
  getFireworksNumber: data => fireworksOperations.getNumber(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Fireworks)
