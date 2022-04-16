import React, { Component } from 'react'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './progress.css'
import $ from 'jquery'

export class Progress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      source: GROUND_SERVER_URL,
      rois: this.requestObject('/api/v1/roi'),
      images: this.requestObject('/api/v1/image/all/0'),
      assignments: this.requestObject('/api/v1/assignment/allusers'),
      targetSightings: this.requestObject('/api/v1/alphanum_target_sighting'),
      targets: this.requestObject('/api/v1/alphanum_target'),
      imagesPending: 0,
    }
  }

  requestObject(url) {
    var res = $.ajax({
      url: url,
      type: 'GET',
      async: false
    })
    return res.responseJSON
  }


  getCount(property) {
    return Object.keys(property).length
  }

  getAssignmentsProcessed() {
    let count = 0
    Object.values(this.state.assignments).forEach(
      assignmentDetails => {
        if (assignmentDetails.done == true) { count = count + 1 }
      }
    )
    this.state.imagesPending = Object.keys(this.state.assignments).length - count
    return count
  }

  render(e) {

    return (
      <div>
        <div>
          <p>Images Received: {this.getCount(this.state.images)}</p>
          <p>Images Assigned: {this.getCount(this.state.assignments)}</p>
          <p>Images Processed: {this.getAssignmentsProcessed(this.state.assignments)}</p>
          <p>Images Pending: {this.state.imagesPending} </p>
          <p>Total ROIs: {this.getCount(this.state.rois)}</p>
          <p>Total Target Sightings: {this.getCount(this.state.targetSightings)}</p>
          <p>Total Targets: {this.getCount(this.state.targets) - 1}</p>
        </div>
      </div>
    )
  }
}
//subtracted 1 from targets for the off-axis default target
//<img src={'http://localhost:9000' + '/api/v1/planeletTest/file/test_' + this.state.link} className='controllerimage'/>

export default Progress
