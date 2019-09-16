import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fromJS } from 'immutable'

// Although these are both imported here, you will have to complete both of them to use them properly
import fireworksReducer from '../../reducers/fireworksReducer.js'
import fireworksOperations from '../../operations/fireworksOperations.js'

import { GET_SETTINGS } from '../../util/config.js'

import Radio from './components/Radio.js'
import TextField from './components/TextField.js'

import './fireworks.css'

export class Fireworks extends Component {
  constructor(props){
    super(props)
    // This initializes the local state
    this.state = {
      color: 'red',
      number: 0
    }

    /* Fireworks functions */
    /* All functions (except for componentDidMount(), componentDidUpdate(prevProps), and render(), all of which are built-in
    React.js function) must be bound to the Fireworks class so that the functions can be used. I have provided an example
    for the function getSavedFields(). You should finish the rest! */
    this.getSavedFields = this.getSavedFields.bind(this)
  }

  /* Every second, componentDidMount() checks to see what the fireworks settings are on the plane and compares those
  to the currently selected setting on the frontend. (What button is pressed, what the "number" value is) */
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

  /* componentDidUpdate(prevProps) helps to determine whether or not the currently-selected fireworks setting on the frontend is
  equal or not to the fireworks setting on the plane. If the two are not equal, the currently-selected setting,
  either after a new setting is sent from the frontend or when the frontend first loads up, is set to the
  firework setting that is currently on the plane. */
  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props) && (
      this.props.settings.get('settings').get('color') !== this.state.color &&
      this.props.settings.get('settings').get('number') !== this.state.number
    )) {
      this.state.color = this.props.settings.get('settings').get('color')
      this.state.number = this.props.settings.get('settings').get('number')
    }
  }

  /* getSavedFields() returns the fireworks setting that is currently saved in the "store". If the term "store" is unfamiliar,
  I would definitely recommend checking out the Redux tutorial linked in the Planelet Projects doc. It's honestly a great
  intro to Redux. */
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

  /* getDisplayFields() returns a merged version (using Lodash's merge function) of the saved fields and the
  current state. Check out any of the other settings files for examples on how to complete the function.
  I believe they are all almost if not completely identical and are done in one line. */
  getDisplayFields() {

  }

  /* getNewFields() essentially takes the output of getDisplayFields() and does minimal correction if need be.
  For example, it might be a good idea to convert the 'number' value to an integer if it for reason happens to
  be a string. Then return the minimally corrected data. Again, examples of getNewFields() can be found in other settings
  files. */
  getNewFields() {

  }

  /* canSave() determines whether or not the currently-selected fireworks setting can be "saved", or sent to the
  plane. To make this determination, canSave() should do a few things: type checking/conversion, making sure that
  there are no other fireworks settings that are "pending", or still waiting to be fully sent to the plane, and
  ensuring that the currently-selected settings are not the same as the currently-saved settings on the plane. If
  the last is true, there is no reason to save/send the same settings to the plane. The settings are already there.
  Again, examples of canSave() can be found in the other settings files. */
  canSave() {

  }

  /* save() should, if the currently-selected fireworks settings can be saved (hint right there), save the
  currently-selected settings to the plane. This involves getting the new fields (again, another hint),
  starting the "update settings" process (calling this.props.updateSettingsStart(some_parameter)), and then
  re-setting the local state to its default values. Once again, examples of save() can be found in other settings
  files. */
  save() {

  }

  /* I have given this function in its entirety because it deals with some semi-odd Javascript stuff as well as
  the structure of some custom components (in this case, the "Radio" component). colorChange(e) changes the color
  of the local state to whatever color is chosen using the frontend and is called whenever a user selects a
  different color on the frontend. */
  colorChange(e) {
    let newLocal = _.cloneDeep(this.state)

    // Gets the newly-selected color
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

    // Changes the local state
    this.setState(newLocal)
  }

  /* I have given this function in its entirety for the same reasons I gave colorChange(e) in its entirety.
  The two functions are actually quite similar in that they both change the local state whenever a user
  makes a change on the frontend. The only difference is that while colorChange(e) deals with changing the
  "color" property of a fireworks setting, numberChange(e) deals with, as you might have guessed, the
  "number" property of a fireworks setting. */
  numberChange(e) {
    let newLocal = _.cloneDeep(this.state)
    /* Does some "type-checking" (using something called "regular expressions". You can ask one of us about them and/or
    look them up if you are interested) and some other pre-processing of the "number" value */
    let val = e.target.value.match(/^[-]?[\d]*\.?[\d]*$/)

    if (val === null) {
      val = ''
    } else {
      val = parseFloat(val[0])
      val = isNaN(val) ? '' : val
    }

    newLocal.color = val

    // Changes the local state
    this.setState(newLocal)
  }

  /* render() is the function that, as might be expected, "renders" the actual web page. You can do some pre-processing and
  other logic in the render() function, as is done below, before dealing with any HTML. In fact, all the HTML is simply returned
  at the end of the render() function. */
  render() {
    let display = this.getDisplayFields()
    // These three fields help with the "Radio" buttons that are used to select each of the three colors
    let redSelected = display.color === 'red'
    let greenSelected = display.color === 'green'
    let blueSelected = display.color === 'blue'

    // This logic deals with the coloring of the "Save" button
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

// This allows us to access and use the Fireworks "store", or the actual state of the Fireworks class/component
const mapStateToProps = state => ({
  settings: state.fireworksReducer
})

/* This allows us to access and use functions from the fireworksOperations.js file. The functions essentially allow
us to start the process of saving a Fireworks setting to the plane (updateSettingsStart) as well as get the
currently-saved Fireworks setting from the plane (getFireworksColor and getFireworksNumber) */
const mapDispatchToProps = dispatch => ({
  updateSettingsStart: data => fireworksOperations.updateSettingsStart(dispatch)(fromJS(data)),
  getFireworksSetting: data => fireworksOperations.getSetting(dispatch)
})

// This basically lets other files access this file/the Fireworks component in general
export default connect(mapStateToProps, mapDispatchToProps)(Fireworks)
