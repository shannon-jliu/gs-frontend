import React, { useState } from 'react'
import { connect } from 'react-redux'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

import PSModeSelect from './PSModeSelect.js'
import { update } from 'lodash'
import Slider from '../tag/components/slider.js'
import TextField from '../settings/components/TextField.js'

export function Progress() {
  const source = GROUND_SERVER_URL
  const [rois] = useState(() => requestObject('/api/v1/roi'))
  const [images] = useState(() => requestObject('/api/v1/image/all/0'))
  const [assignments] = useState(() => requestObject('/api/v1/assignment/allusers'))
  const [targets] = useState(() => requestObject('/api/v1/alphanum_target'))
  const [targetSightings] = useState(() => requestObject('/api/v1/alphanum_target_sighting'))
  const [recentImage, setRecentImage] = useState(() => requestObject('/api/v1/image/recent')['imageUrl'])
  const [recentImageTest, setRecentImageTest] = useState(() => 'url("' + GROUND_SERVER_URL + requestObject('/api/v1/image/recent')['imageUrl'] + '")')
  const [recentImageTestTwo, setRecentImageTestTwo] = useState(() => GROUND_SERVER_URL + requestObject('/api/v1/image/recent')['imageUrl'])


  // Plane System Data:
  // const currentFocalLength = useState(() => requestObject('/endpoint/here'))
  const [focalLength, setFocalLength] = useState(0.) // floats -> dragger..
  // const currentGimbalPosition = useState(() => requestObject('/endpoint/here'))
  const [gimbalPosition, setGimbalPosition] = useState(0.) // floats -> ?? two numbers
  const [roll, setRoll] = useState(0.)
  const [pitch, setPitch] = useState(0.)
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

  function getCount(data) {
    return Object.keys(data).length
  }

  function getNumAssignmentsProcessed() {
    let count = 0
    Object.values(assignments).forEach(
      assignmentDetails => {
        if (assignmentDetails.done == true) { count = count + 1 }
      }
    )
    // let numPending = Object.keys(assignments).length - count
    // setImagesPending(numPending)
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

  const updateFocalLength = (evt) => {
    let fL = evt.target.value // fL: focal length
    console.log(fL)
    setFocalLength(fL)
  }

  const saveFocalLength = () => {
    console.log(focalLength)
  }

  const updateGimbalPosition = (evt) => {
    let pos = evt.target.value
    console.log(pos)
    setGimbalPosition(pos)
  }

  const saveGimbalPosition = () => {
    console.log(roll)
    console.log(pitch)
  }

  const updateRoll = (evt) => {
    let r = evt.target.value
    setRoll(r)
  }

  const updatePitch = (evt) => {
    let p = evt.target.value
    setPitch(p)
  }

  const updatePSMode = (evt) => {
    let mode = evt.target.value
    // if want to have save button -> create sep vars for the ps mode you show 
    // and the local ps mode var on here
    // i.e. the ps mode displayed in text is just from the endpoint call
    setPSMode(mode)
  }

  const savePSMode = () => {
    console.log(psMode)
  }

  return (
    <div>
      <div className="data-body">
        <div class="plane-system-info">
          <h6>Plane System Metrics</h6>
          {/* focal length */}
          <div class="ps-data">
            <p>Focal Length:
            </p>
            <p>Current: {focalLength} <button onClick={saveFocalLength} className={'waves-effect waves-light btn'}>Save</button>
            </p>
            <div className="dropdown">
              <select onChange={(evt) => updateFocalLength(evt)} value={focalLength} className='browser-default'>
                <option value="1">focal length 1</option>
                <option value="2">focal length 2</option>
                <option value="3">focal length 3</option>
                <option value="4">focal length 4</option>
                <option value="5">focal length 5</option>
              </select>
            </div>
          </div>
          {/* gimbal position */}
          <div class="ps-data">
            <p>Gimbal Position:</p>
            {/* TODO: change display values to those directly from the endpoint */}
            <p>Current: Roll = {roll}, Pitch = {pitch} <button onClick={saveGimbalPosition} className={'waves-effect waves-light btn'}>Save</button>
            </p>
            {/* TODO: fix styling, add validation, maybe call endpoint */}
            <h6>Angle</h6>
            <div>
              <span>
                <input
                  type="roll"
                  onChange={updateRoll}
                  value={roll}
                />
              </span>
            </div>
            <div>
              <span>
                <input
                  type="text"
                  onChange={updatePitch}
                  value={pitch}
                />
              </span>
            </div>
          </div>
          <div class="ps-data">
            <p>PS Modes:</p>
            <p>Current: {psMode} <button onClick={savePSMode} className={'waves-effect waves-light btn'}>Save</button></p>
            {/* needs className='browser-default' to display */}
            <div className="dropdown">
              <select onChange={(evt) => updatePSMode(evt)} value={psMode} className='browser-default'>
                <option value="1">mode 1</option>
                <option value="2">mode 2</option>
                <option value="3">mode 3</option>
                <option value="4">mode 4</option>
                <option value="5">mode 5</option>
              </select>
            </div>
          </div>
        </div>
        {/* <div
          className="image-viewer-progress"
          style={{
            backgroundImage: recentImageTest,
            backgroundSize: '100px 100px',
          }}
        >
        </div> */}
        <div class="target-info">
          <h6>Target Metrics</h6>
          <p>Images Received: {getCount(images)}</p>
          <p>Images Assigned: {getCount(assignments)}</p>
          <p>Images Processed: {getNumAssignmentsProcessed()}</p>
          <p>Images Pending: {getNumAssignmentsPending()} </p>
          <p>Percentage Images Processed: {(getNumAssignmentsProcessed() / getCount(images)) * 100}%</p>
          <p>Total ROIs: {getCount(rois)}</p>
          <p>Total Target Sightings: {getCount(targetSightings)}</p>
          {/* <p>Total Targets: {getCount(targets) - 1}</p> */}
        </div>
        {/* <div
          className="image-viewer-progress"
          style={{
            backgroundImage: recentImageTest,
            backgroundSize: '100px 100px',
          }}
        >
        </div> */}
      </div>
      <img width="45%" height="100%" src={recentImageTestTwo}></img>

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
