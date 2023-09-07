import React, { useState, useEffect } from 'react'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

export default function Progress() {
  const source = GROUND_SERVER_URL
  const [rois, setRois] = useState(() => requestObject('/api/v1/roi'))
  const [images, setImages] = useState(() => requestObject('/api/v1/image/all/0'))
  const [assignments, setAssignments] = useState(() => requestObject('/api/v1/assignment/allusers'))
  const [targets, setTargets] = useState(() => requestObject('/api/v1/alphanum_target'))
  const [targetSightings, setTargetSightings] = useState(() => requestObject('/api/v1/alphanum_target_sighting'))
  const [imagesPending, setImagesPending] = useState(0)

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
    let numPending = Object.keys(assignments).length - count
    setImagesPending(numPending)
    return count
  }

  return (
    <div>
      <div>
        <p>text here</p>
        {/* to ask: what is the difference btwn images received and processed? */}
        <p>Images Received: {() => getCount(images)}</p>
        <p>Images Assigned: {() => getCount(assignments)}</p>
        <p>Images Processed: {() => getNumAssignmentsProcessed()}</p>
        <p>Images Pending: {imagesPending} </p>
        <p>Percentage Images Processed: {() => (getNumAssignmentsProcessed() / getCount(images))}</p>
        <p>Total ROIs: {() => getCount(rois)}</p>
        <p>Total Target Sightings: {() => getCount(targetSightings)}</p>
        <p>Total Targets: {() => getCount(targets) - 1}</p>
      </div>
    </div>
  )
}
//subtracted 1 from targets for the off-axis default target
//<img src={'http://localhost:9000' + '/api/v1/planeletTest/file/test_' + this.state.link} className='controllerimage'/>
