import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

import ImageViewer from '../../components/imageViewer'
import PSModeSelect from './PSModeSelect.js'
import { update } from 'lodash'

export function Progress() {
  const source = GROUND_SERVER_URL
  const [rois, setRois] = useState(() => requestObject('/api/v1/roi'))
  const [images, setImages] = useState(() => requestObject('/api/v1/image/all/0'))
  const [assignments, setAssignments] = useState(() => requestObject('/api/v1/assignment/allusers'))
  const [targets, setTargets] = useState(() => requestObject('/api/v1/alphanum_target'))
  const [targetSightings, setTargetSightings] = useState(() => requestObject('/api/v1/alphanum_target_sighting'))
  const [recentImage, setRecentImage] = useState(() => requestObject('/api/v1/image/recent')['imageUrl'])
  // const [imagesPending, setImagesPending] = useState(0)
  // const [recentImage, setRecentImage] = useState(() => requestObject('/api/v1/image/all/0'))

  // Plane System
  const [focalLength] = useState(0) // floats -> dragger..
  const [gimbalPosition] = useState(0) // floats -> ?? two numbers
  const [currentPSMode, setPSMode] = useState('default-mode') // dropdown values

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

  // updateTargetInformation(evt, target, index, x) {
  //   let newState = _.cloneDeep(this.state)
  //   let val = evt.target.value
  //   if (x == 1) newState.targets[index].shapeColor = val
  //   if (x == 2) newState.targets[index].shape = val
  //   if (x == 3) newState.targets[index].alphaColor = val
  //   if (x == 4) newState.targets[index].alpha = val
  //   this.setState(newState)
  // }

  function updatePSMode(evt) {
    let mode = evt
    console.log(currentPSMode)
    console.log(evt)
    setPSMode(mode)
  }


  return (
    <div>
      <div className="data-body">
        <div class="plane-system-info">
          <h5>Plane System Metrics</h5>
          {/* focal length */}
          <div>
            {/* get focal length: insert a slider - grab focal length and display above the slider */}
            <p>Focal Length:</p>
            <p>focal length num here</p>
            {/* slider */}
          </div>
          {/* gimbal position */}
          <div>
            <p>Gimbal Position:</p>
            {/* ?? */}
          </div>
          <div>
            <p>Current PS Mode:</p>
            <p>Current mode name here</p>
            {/* grab name of current ps mode and display here */}
            {/* <select name="selectPSMode" id="selectPSMode" onChange={(evt) => setPSMode(evt)}> */}

            {/* needs className='browser-default' to display */}
            <div className="classname">
              <select onChange={(evt) => updatePSMode(evt)} value={currentPSMode} className='browser-default'>
                <option value="1">mode 1</option>
                <option value="2">mode 2</option>
                <option value="3">mode 3</option>
                <option value="4">mode 4</option>
                <option value="5">mode 5</option>
              </select>
            </div>

            {/* <select name="selectNumTargets" id="selectNumTargets" onChange={(evt) => this.updateStateTargetsNum(evt)} className='browser-default'>
              <option value="1">1</option>
              <option selected value="2">2</option>
            </select> */}

            {/* <button onClick={this.saveNumTargets.bind(this)} className={saveClass}>Save</button></div> */}
          </div>
        </div>

        <div class="target-info">
          <h5>Target Metrics</h5>
          <p>Images Received: {getCount(images)}</p>
          <p>Images Assigned: {getCount(assignments)}</p>
          <p>Images Processed: {getNumAssignmentsProcessed()}</p>
          <p>Images Pending: {getNumAssignmentsPending()} </p>
          <p>Percentage Images Processed: {(getNumAssignmentsProcessed() / getCount(images)) * 100}%</p>
          <p>Total ROIs: {getCount(rois)}</p>
          <p>Total Target Sightings: {getCount(targetSightings)}</p>
          {/* <p>Total Targets: {getCount(targets) - 1}</p> */}
        </div>
      </div>
      <div className="recent-image">
        <div className="detect">
          <div className="tag-image card">
            <ImageViewer
              imageUrl={recentImage}
              taggable={false}
              onTag={() => 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  psMode: state.progressReducer,
  // settings: state.fiveTargetsReducer,
  // numTargets: state.fiveTargetsReducer.get('settings').get('numTargets'),
  // savedTargets: state.targetReducer.get('saved'),
  //calls reducer to get thumbnails
  // thumbnails: getThumbnails(state.thumbnailReducer),
})

// Redux tool to trigger a state change
const mapDispatchToProps = (dispatch) => ({

  // saveTarget: TargetOperations.saveTarget(dispatch),
  // deleteTargets: TargetOperations.deleteAllTargets(dispatch),
  // updateNumTargets: fiveTargetsSettingsOperations.updateNumTargets(dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Progress)

//subtracted 1 from targets for the off-axis default target
//<img src={'http://localhost:9000' + '/api/v1/planeletTest/file/test_' + this.state.link} className='controllerimage'/>
