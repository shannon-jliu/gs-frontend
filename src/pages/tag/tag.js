import React, { Component } from 'react'

import AuthUtil from '../../util/authUtil.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

import ImageViewer from '../../components/imageViewer.js'

import './tag.css'

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
      <div className="tag">
        <div className="tag-image card">
          <ImageViewer
            taggable={true}
            onTag={this.onTag}
          />
        </div>
      </div>
    )
  }
}

export default Tag
