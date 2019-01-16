import React, { Component } from 'react'
import { fromJS } from 'immutable' // remove this after testing as well
import AuthUtil from '../../util/authUtil.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

import ImageViewer from '../../components/imageViewer.js'
import TagSighting from './tagSighting'

import './tag.css'

// tODO remove after testing
const sighting = fromJS({
  height: 1405,
  localId: '979.6291390728477:526.5298013245033:702.620099040495:0.0006300101418243997',
  pixelX: 980,
  pixelY: 527,
  radiansFromTop: 2.5051419954498755,
  width: 1405,
})

class Tag extends Component {
  constructor(props){
    super(props)
    this.onTag = this.onTag.bind(this)
  }

  onTag(tagged) {
    // temporary function, will impl later
  }

  render(e) {
    return (
      <div className='tag'>
        <div className='tag-image card'>
          <ImageViewer
            taggable={true}
            onTag={this.onTag}
          />
        </div>
        <div className='sightings'>
          <TagSighting sighting={sighting}/>
          <TagSighting sighting={sighting}/>
        </div>
      </div>
    )
  }
}

export default Tag
