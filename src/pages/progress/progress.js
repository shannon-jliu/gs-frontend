import React, { useState } from 'react'
import { connect } from 'react-redux'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

import PSModeSelect from './PSModeSelect.js'
import { update } from 'lodash'
import Slider from '../tag/components/slider.js'
import TextField from '../settings/components/TextField.js'
import { PlaneSystemRequests } from '../../util/sendApi'
import SnackbarUtil from '../../util/snackbarUtil.js'

export function Progress() {
  const source = GROUND_SERVER_URL
  const [rois] = useState(() => requestObject('/api/v1/roi'))
  const [images] = useState(() => requestObject('/api/v1/image/all/0'))
  const [assignments] = useState(() => requestObject('/api/v1/assignment/allusers'))
  const [targets] = useState(() => requestObject('/api/v1/alphanum_target'))
  const [targetSightings] = useState(() => requestObject('/api/v1/alphanum_target_sighting'))
  const [recentImage, setRecentImage] = useState(() => requestObject('/api/v1/image/recent'))

  // Plane System Data:
  // const currentFocalLength = useState(() => requestObject('/endpoint/here'))
  const [focalLength, setFocalLength] = useState(10.0) // insert a default val
  // const currentGimbalPosition = useState(() => requestObject('/endpoint/here'))
  // change based on how data is sent
  const [gimbalPosition, setGimbalPosition] = useState(0.) // floats -> ?? two numbers
  const [roll, setRoll] = useState(0.)
  const [pitch, setPitch] = useState(0.)
  const [inactive, setInactive] = useState(0.)
  const [active, setActive] = useState(0.)
  // const currentPSMode = useState(() => requestObject('/endpoint/here'))
  const [psMode, setPSMode] = useState(1) // dropdown values

  // Getting data from the ground server
  function requestObject(url) {
    var res = $.ajax({
      url: url,
      type: 'GET',
      async: false,
    })
    return res.responseJSON
  }

  function getImageUrl() {
    if (recentImage == undefined) {
      // fun other to do: switch 0 to like a fun default image that says "no images found" or something idk
      return 0
    }
    return GROUND_SERVER_URL + recentImage['imageUrl']
  }

  function getCount(data) {
    if (data == undefined) {
      return 0
    }
    return Object.keys(data).length
  }

  function getNumAssignmentsProcessed() {
    let count = 0
    if (Object.values(assignments) != null) {
      Object.values(assignments).forEach(
        assignmentDetails => {
          if (assignmentDetails.done == true) { count = count + 1 }
        }
      )
    }
    return count
  }

  function getNumAssignmentsPending() {
    let count = 0
    Object.values(assignments).forEach(
      assignmentDetails => {
        if (assignmentDetails.done == true) { count = count + 1 }
      }
    )
    let numPending = Object.keys(assignments).length - count
    return numPending
  }

  function getPercentProcessed() {
    if (getCount(images) == 0) {
      return 0
    }
    return ((getNumAssignmentsProcessed() / getCount(images)) * 100).toFixed(2)
  }

  const updateFocalLength = (evt) => {
    // maybe delete local storing to just have it update focal length with 
    // endpoint, and locally grab focal length with endpoint later
    let fL = evt.target.value // fL: focal length
    console.log('value: ' + fL)
    setFocalLength(fL)
  }

  const saveFocalLength = () => {
    console.log('focal length' + focalLength)
    let fLFloat = parseFloat(focalLength)
    const success = data => {
      console.log(data)
      // dispatch(action.updateAssignment(fromJS(data)))
      // AssignmentOperations.getNextAssignment(dispatch)(currAssignment)
    }
    const failure = () => {
      // TODO: bug... goes here instead of success
      SnackbarUtil.render('Failed to complete assignment')
      // dispatch(action.finishLoading())
    }
    PlaneSystemRequests.saveFocalLength(fLFloat, success, failure)
    console.log('after the maybe post request')
  }

  const updateGimbalPosition = (evt) => {
    let pos = evt.target.value
    console.log(pos)
    setGimbalPosition(pos)
  }

  const saveGimbalPosition = () => {
    console.log(roll)
    console.log(pitch)
    const success = data => {
      console.log(data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }
    PlaneSystemRequests.saveGimbalPosition(roll, pitch, success, failure)
  }

  const updateTextFields = (evt) => {
    let val = evt.target.value.match(/^[-]?[\d]*\.?[\d]*$/)
    if (val === null) {
      val = ''
    } else {
      val = parseFloat(val[0])
      val = isNaN(val) ? '' : val
    }
    if (evt.target.id === "roll") { setRoll(val) }
    if (evt.target.id === "pitch") { setPitch(val) }
    if (evt.target.id === "inactive") { setInactive(val) }
    if (evt.target.id === "active") { setActive(val) }
  }

  const updatePSMode = (evt) => {
    let mode = evt.target.value
    // based on ps mode sent, show diff divs
    // aka if time-search then show div for taking in inactive and active inputs
    setPSMode(mode)
  }

  const savePSMode = () => {
    console.log(psMode)
    const success = data => {
      console.log(data)
    }
    const failure = () => {
      SnackbarUtil.render('Failed to complete assignment')
    }

    let val = "time-search"
    if (psMode == 1) {
      val = "pan-search"
    }
    else if (psMode == 2) {
      val = "manual-search"
    }
    else if (psMode == 3) {
      val = "distance-search"
    }

    if (val != "time-search") {
      PlaneSystemRequests.savePlaneSystemMode(val, success, failure)
    }
    else {
      PlaneSystemRequests.savePlaneSystemModeTimeSearch(inactive, active, success, failure)
    }
  }

  return (
    <div>
      <div className="data-body">
        <div class="plane-system-info">
          <h5>Plane System Metrics</h5>
          {/* focal length */}
          <div class="ps-data">
            <h6>Focal Length:<button onClick={saveFocalLength} className={'waves-effect waves-light btn'}>Save</button></h6>
            <h7>Current: {focalLength}</h7>
            <div className="dropdown">
              {/* change to be text input -> add some sort of validation ?? unless dropdown is easier */}
              <select onChange={(evt) => updateFocalLength(evt)} value={focalLength} className='browser-default'>
                <option value="10.0">10.0</option>
                <option value="22.1">22.1</option>
                <option value="14.5">14.5</option>
                <option value="40.4">40.4</option>
                <option value="105.6">105.6</option>
              </select>
            </div>
          </div>
          {/* gimbal position */}
          <div class="ps-data">
            <h6>Gimbal Position: <button onClick={saveGimbalPosition} className={'waves-effect waves-light btn'}>Save</button></h6>
            {/* TODO: change display values to those directly from the endpoint */}
            <h7>Current: Roll = {roll}, Pitch = {pitch}</h7>
            <div>
              <input
                type="text"
                onChange={updateTextFields}
                value={roll}
                id="roll"
              />
              <label>Roll</label>
              <input
                type="text"
                onChange={updateTextFields}
                value={pitch}
                id="pitch"
              />
              <label>Pitch</label>
            </div>
          </div>
          <div class="ps-data">
            <h6>PS Modes:<button onClick={savePSMode} className={'waves-effect waves-light btn'}>Save</button></h6>
            <h7>Current: {psMode}</h7>
            {/* Note: needs className='browser-default' to display */}
            <div className="dropdown">
              <select onChange={(evt) => updatePSMode(evt)} value={psMode} className='browser-default'>
                <option value="1">Pan Search</option>
                <option value="2">Manual Search</option>
                <option value="3">Distance Search</option>
                <option value="4">Time Search</option>
              </select>
              <div className={psMode == "4" ? "" : "hidden"}>
                <div>
                  <span>
                    <input
                      type="text"
                      onChange={updateTextFields}
                      value={inactive}
                      id="inactive"
                    />
                    <label>Inactive</label>
                  </span>
                </div>
                <div>
                  <span>
                    <input
                      type="text"
                      onChange={updateTextFields}
                      value={active}
                      id="active"
                    />
                    <label>Active</label>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="target-info">
          <h5>Target Metrics</h5>
          <p>Images Received: {getCount(images)}</p>
          <p>Images Assigned: {getCount(assignments)}</p>
          <p>Images Processed: {getNumAssignmentsProcessed()}</p>
          <p>Images Pending: {getNumAssignmentsPending()} </p>
          <p>Percentage Images Processed: {getPercentProcessed()}%</p>
          <p>Total ROIs: {getCount(rois)}</p>
          <p>Total Target Sightings: {getCount(targetSightings)}</p>
        </div>
      </div>
      <img width="40%" height="100%" src={getImageUrl()} alt="No Images"></img>
    </div >
  )
}

// ignore for now: here in case we need redux..
/*
const mapStateToProps = (state) => ({
  psMode: state.progressReducer,
  // settings: state.fiveTargetsReducer,
  // numTargets: state.fiveTargetsReducer.get('settings').get('numTargets'),
})

// Redux tool to trigger a state change
const mapDispatchToProps = (dispatch) => ({
  // saveTarget: TargetOperations.saveTarget(dispatch),\
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Progress)
*/
export default Progress

//subtracted 1 from targets for the off-axis default target
//<img src={'http://localhost:9000' + '/api/v1/planeletTest/file/test_' + this.state.link} className='controllerimage'/>
