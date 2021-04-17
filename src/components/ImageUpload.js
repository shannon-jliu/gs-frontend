import React, { Component } from 'react'
import _ from 'lodash'

import SnackbarUtil from '../util/snackbarUtil.js'
import { ImageRequests } from '../util/sendApi'

class ImageUpload extends Component {
  constructor(props) {
    super(props)

    this.onFileUpload = this.onFileUpload.bind(this)
    this.handleFileSelect = this.handleFileSelect.bind(this)
  }

  readJSON(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onerror = reject
      fr.onload = function () {
        resolve(fr.result)
      }
      fr.readAsText(file)
    })
  }

  onFileUpload(files) {
    const failure = (imgName, message) => {
      SnackbarUtil.render('Failed to upload ' + imgName + ', reason: ' + message)
    }

    let successfulImages = 0
    let promises = []
    let jsonFiles = Object.values(files).filter(f => f.type == 'application/json')
    let imgFiles = Object.values(files).filter(f => f.type != 'application/json')

    _.forEach(imgFiles, file => {
      const fn = file.name.substring(0, file.name.lastIndexOf('.'))

      // Get the corresponding json file
      let jsonFile = jsonFiles.filter(f => f.name == fn + '.json')
      jsonFile = jsonFile.length > 0 ? jsonFile[0] : null


      const imgName = Number(file.name.substring(0, file.name.indexOf('.')))
      this.readJSON(jsonFile).then(data => promises.push(
        ImageRequests.sendImage(
          file,
          data,
          () => successfulImages += 1,
          failure
        )
      ))
    })

    // run all in parallel
    return Promise.all(promises).then(() => {
      SnackbarUtil.render(successfulImages + ' images successfully uploaded')
    })
  }

  handleFileSelect(e) {
    e.preventDefault()
    this.fileSelector.click()
  }

  render() {
    this.fileSelector = document.createElement('input')
    this.fileSelector.setAttribute('type', 'file')
    this.fileSelector.setAttribute('multiple', 'multiple')
    this.fileSelector.setAttribute('accept', 'image/*,application/JSON')
    this.fileSelector.onchange = e => {
      this.onFileUpload(e.target.files)
    }
    return (
      <a className='button' href='' onClick={this.handleFileSelect}>
        <i className='material-icons'>file_upload</i>
      </a>
    )
  }
}

export default ImageUpload
