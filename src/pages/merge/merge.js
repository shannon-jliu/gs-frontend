import React, { Component } from 'react'
import { fromJS } from 'immutable'

import MergeSighting from './mergeSighting.js'

import './merge.css'

import DEFAULT_IMG from '../../img/cuair_default.png'

//THIS FILE IS ENTIRELY TEMPORARY
const tempSighting = fromJS({
  type: 'alphanum',
  shapeColor: 'red',
  shape:'square',
  alpha: 'T',
  alphaColor: 'blue',
  mdlcClassConf: 'low',
  offaxis: false,
  height: 1405,
  localId: '979.6291390728477:526.5298013245033:702.620099040495:0.0006300101418243997',
  pixelX: 1100,
  pixelY: 500,
  radiansFromTop: 2.5051419954498755,
  width: 200,
  assignment: {
    image: {
      imageUrl: DEFAULT_IMG
    }
  }
})

class Merge extends Component {
  constructor(props){
    super(props)
  }

  render(e) {
    return (
      <div className='merge'>
        <div className='sightings'>
          <MergeSighting sighting={tempSighting} dragging={false}  />
        </div>
      </div>
    )
  }
}

export default Merge