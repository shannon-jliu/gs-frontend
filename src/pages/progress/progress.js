import React, { useState, useEffect } from 'react'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

import ImageViewer from '../../components/imageViewer'

export default function Progress() {
  const source = GROUND_SERVER_URL
  const [rois, setRois] = useState(() => requestObject('/api/v1/roi'))
  const [images, setImages] = useState(() => requestObject('/api/v1/image/all/0'))
  const [assignments, setAssignments] = useState(() => requestObject('/api/v1/assignment/allusers'))
  const [targets, setTargets] = useState(() => requestObject('/api/v1/alphanum_target'))
  const [targetSightings, setTargetSightings] = useState(() => requestObject('/api/v1/alphanum_target_sighting'))
  const [recentImage, setRecentImage] = useState(() => requestObject('/api/v1/image/recent')["imageUrl"])
  // const [imagesPending, setImagesPending] = useState(0)
  // const [recentImage, setRecentImage] = useState(() => requestObject('/api/v1/image/all/0'))

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

  return (
    <div>
      <div className="data-body">
        <p>Images Received: {getCount(images)}</p>
        <p>Images Assigned: {getCount(assignments)}</p>
        <p>Images Processed: {getNumAssignmentsProcessed()}</p>
        <p>Images Pending: {getNumAssignmentsPending()} </p>
        <p>Percentage Images Processed: {(getNumAssignmentsProcessed() / getCount(images)) * 100}%</p>
        <p>Total ROIs: {getCount(rois)}</p>
        <p>Total Target Sightings: {getCount(targetSightings)}</p>
        {/* <p>Total Targets: {getCount(targets) - 1}</p> */}
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
//subtracted 1 from targets for the off-axis default target
//<img src={'http://localhost:9000' + '/api/v1/planeletTest/file/test_' + this.state.link} className='controllerimage'/>
