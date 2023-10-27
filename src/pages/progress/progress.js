import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

import PSModeSelect from './PSModeSelect.js'
import { update } from 'lodash'
import Slider from '../tag/components/slider.js'
import TextField from '../settings/components/TextField.js'
import { PlaneSystemRequests } from '../../util/sendApi'
import ProgressOperations from '../../operations/progressOperations.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

export function Progress() {
  const source = GROUND_SERVER_URL
  const [rois, setRois] = useState(() => requestObject('/api/v1/roi'))
  const [images, setImages] = useState(() => requestObject('/api/v1/image/all/0'))
  const [assignments, setAssignments] = useState(() => requestObject('/api/v1/assignment/allusers'))
  const [targetSightings, setTargetSightings] = useState(() => requestObject('/api/v1/alphanum_target_sighting'))
  const [recentImage, setRecentImage] = useState(() => requestObject('/api/v1/image/recent'))

  // Plane System Data:
  // floats:
  const [focalLength, setFocalLength] = useState(10.0) // insert a default val
  const [roll, setRoll] = useState(0.)
  const [pitch, setPitch] = useState(0.)
  const [inactive, setInactive] = useState(0.)
  const [active, setActive] = useState(0.)
  // ints:
  const [zoomLevel, setZoomLevel] = useState(0)
  const [aperture, setAperture] = useState(0)
  const [numerator, setNumerator] = useState(0)
  const [denominator, setDenominator] = useState(0)
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

  const fetchTargetMetrics = async () => {
    try {
      const newRois = await requestObject('/api/v1/roi')
      setRois(newRois)
      const newImages = await requestObject('/api/v1/image/all/0')
      setImages(newImages)
      const newAssignments = await requestObject('/api/v1/assignment/allusers')
      setAssignments(newAssignments)
      const newTargetSightings = await requestObject('/api/v1/image/recent')
      setTargetSightings(newTargetSightings)
    }
    catch (error) {
      console.error("Error fetching target metrics: ", error)
    }
  }

  const fetchRecentImage = async () => {
    try {
      const newRecentImage = await requestObject('/api/v1/image/recent');
      setRecentImage(newRecentImage);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error fetching recent image:', error);
    }
  };

  useEffect(() => {
    // Fetch the recent image immediately
    fetchRecentImage()
    fetchTargetMetrics()

    // Set up an interval to fetch the recent image every 3.5 seconds (3500 milliseconds)
    const intervalId = setInterval(() => {
      fetchRecentImage();
      fetchTargetMetrics()
    }, 3500);

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

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
    if (assignments != null) {
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
    if (assignments != null) {
      Object.values(assignments).forEach(
        assignmentDetails => {
          if (assignmentDetails.done == true) { count = count + 1 }
        }
      )
      let numPending = Object.keys(assignments).length - count
      return numPending
    }
  }

  function getPercentProcessed() {
    if (getCount(images) == 0) {
      return 0
    }
    return ((getNumAssignmentsProcessed() / getCount(images)) * 100).toFixed(2)
  }

  const updateTextFields = (evt) => {
    let val = evt.target.value.match(/^[-]?[\d]*\.?[\d]*$/)
    let id = evt.target.id
    if (val === null) {
      val = ''
    } else {
      if (id === 'zoomLevel' || id === 'aperture' || id === 'numerator' || id === 'denominator') {
        val = parseInt(val[0])
      } else {
        val = parseFloat(val[0])
      }
      val = isNaN(val) ? '' : val
    }
    if (id === 'roll') { setRoll(val) }
    if (id === 'pitch') { setPitch(val) }
    if (id === 'inactive') { setInactive(val) }
    if (id === 'active') { setActive(val) }
    if (id === 'focalLength') { setFocalLength(val) }
    if (id === 'zoomLevel') { setZoomLevel(val) }
    if (id === 'aperture') { setAperture(val) }
    if (id === 'numerator') { setNumerator(val) }
    if (id === 'denominator') { setDenominator(val) }
  }

  const updatePSMode = (evt) => {
    let mode = evt.target.value
    // based on ps mode sent, show diff divs
    // aka if time-search then show div for taking in inactive and active inputs
    setPSMode(mode)
  }

  const saveFocalLength = () => {
    let fLFloat = parseFloat(focalLength)
    console.log('focal length' + fLFloat)
    // TODO: if dispatch is needed change this call and the below
    ProgressOperations.saveFocalLength(fLFloat)
  }

  const saveZoomLevel = () => {
    ProgressOperations.saveZoomLevel(zoomLevel)
  }

  const saveAperture = () => {
    ProgressOperations.saveAperture(aperture)
  }

  const saveShutterSpeed = () => {
    ProgressOperations.saveShutterSpeed(numerator, denominator)
  }

  const saveGimbalPosition = () => {
    ProgressOperations.saveGimbalPosition(roll, pitch)
  }

  const savePSMode = () => {
    ProgressOperations.savePSMode(psMode, inactive, active)
  }

  const saveCapture = () => {
    ProgressOperations.saveCapture()
  }

  return (
    <div>
      <div className="data-body">
        <div class="plane-system-info">
          <h5>Plane System Settings & Metrics</h5>
          {/* PS Modes */}
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
              <div className={psMode == '4' ? '' : 'hidden'}>
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
          {/* gimbal position */}
          <div class="ps-data">
            <h6>Gimbal Position: <button onClick={saveGimbalPosition} className={'waves-effect waves-light btn'}>Save</button></h6>
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
          {/* focal length */}
          <div class="ps-data">
            <h6>Focal Length:<button onClick={saveFocalLength} className={'waves-effect waves-light btn'}>Save</button></h6>
            {/* Note: doesn't actually display current focal length - does not exist a way to get focal length on ps rn */}
            <h7>Current: {focalLength}</h7>
            <div>
              <input
                type="text"
                onChange={updateTextFields}
                value={focalLength}
                id="focalLength"
              />
            </div>
          </div>
          {/* zoom level */}
          <div class="ps-data">
            <h6>Zoom Level: <button onClick={saveZoomLevel} className={'waves-effect waves-light btn'}>Save</button></h6>
            <h7>Current: {zoomLevel}</h7>
            <div>
              <input
                type="text"
                onChange={updateTextFields}
                value={zoomLevel}
                id="zoomLevel"
              />
            </div>
          </div>
          {/* aperture */}
          <div class="ps-data">
            <h6>Aperture: <button onClick={saveAperture} className={'waves-effect waves-light btn'}>Save</button></h6>
            <h7>Current: {aperture}</h7>
            <div>
              <input
                type="text"
                onChange={updateTextFields}
                value={aperture}
                id="aperture"
              />
            </div>
          </div>
          {/* shutter speed */}
          <div class="ps-data">
            <h6>Shutter Speed: <button onClick={saveShutterSpeed} className={'waves-effect waves-light btn'}>Save</button></h6>
            <h7>Current: Numerator = {numerator}, Denominator = {denominator}</h7>
            <div>
              <input
                type="text"
                onChange={updateTextFields}
                value={numerator}
                id="numerator"
              />
              <label>Numerator</label>
              <input
                type="text"
                onChange={updateTextFields}
                value={denominator}
                id="denominator"
              />
              <label>Denominator</label>
            </div>
          </div>
          {/* capture */}
          <div>
            <h6>Capture: <button onClick={saveCapture} className={'waves-effect waves-light btn'}>Capture</button></h6>
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
