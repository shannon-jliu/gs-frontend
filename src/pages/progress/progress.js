import React, { useState } from 'react'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

const Progress = () => {
  const source = GROUND_SERVER_URL
  const rois = useState(() => requestObject('/api/v1/roi'))
  const images = useState(() => requestObject('/api/v1/image/all/0'))
  const assignments = useState(() => requestObject('/api/v1/assignment/allusers'))
  const targets = useState(() => requestObject('/api/v1/alphanum_target'))
  const targetSightings = useState(() => requestObject())
  const [imagesPending, setImagesPending] = useState(0)

  /*
  data needed: percentage of processed images
   */

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

  function getNumAssignmentsProcessed(a) {
    let count = 0
    Object.values(a).forEach(
      assignmentDetails => {
        if (assignmentDetails.done == true) { count = count + 1 }
      }
    )
    setImagesPending(Object.keys(a).length - count)
    return count
  }

  /*
  Number of tagged images corresponding to each target (up to all 5)
Number of images received, processed, and pending, with the percentage that has been processed or needs to be processed
Number of ROIs? 
 */

  return (
    <div>
      <div>
        <p>text here</p>
        <p>Images Received: {getCount(images)}</p>
        <p>Images Assigned: {getCount(assignments)}</p>
        {/* <p>Images Processed: {getNumAssignmentsProcessed(assignments)}</p> // TODO: doesn't work - BREAKS IT */}
        <p>Images Pending: {imagesPending} </p>
        <p>Total ROIs: {getCount(rois)}</p>
        <p>Total Target Sightings: {getCount(targetSightings)}</p>
        <p>Total Targets: {getCount(targets) - 1}</p>
      </div>
    </div>
  )
}
//subtracted 1 from targets for the off-axis default target
//<img src={'http://localhost:9000' + '/api/v1/planeletTest/file/test_' + this.state.link} className='controllerimage'/>
export default Progress