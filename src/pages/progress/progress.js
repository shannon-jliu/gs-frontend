import React, { Component } from 'react'
import {GROUND_SERVER_URL} from '../../constants/links.js'
import './progress.css'
export class Progress extends Component {
  constructor(props){
    super(props)
  }


  render(e) {
    return (
      <div>
        <div>

        </div>
        <div>
          //<button className='custombutton'> <i>Next Image</i></button>
        </div>
      </div>
    )
  }
}

//<img src={'http://localhost:9000' + '/api/v1/planeletTest/file/test_' + this.state.link} className='controllerimage'/>

export default Progress
