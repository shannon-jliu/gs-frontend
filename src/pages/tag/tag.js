import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import _ from 'lodash'
import M from 'materialize-css'
import localforage from 'localforage'
import imageCompression from 'browser-image-compression'

import TargetSightingOperations from '../../operations/targetSightingOperations'
import AssignmentOperations from '../../operations/assignmentOperations'
import ImageViewer from '../../components/imageViewer'
import TagSighting from './tagSighting'
import ImageTools from './imageTools'

import { GROUND_SERVER_URL } from '../../constants/links'
import { TWO_PASS_MODE } from '../../util/config'
import { AUTH_TOKEN_ID } from '../../constants/constants.js'

import Switch from '../settings/components/Switch'
import './tag.css'

export class Tag extends Component {
  constructor(props){
    super(props)

    this.state = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      isReceiving: true
    }

    this.reset = this.reset.bind(this)
    this.onTag = this.onTag.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrev = this.onPrev.bind(this)
    this.getBase64Image = this.getBase64Image.bind(this)
    this.preloadForage = this.preloadForage.bind(this)
    this.preloadForageFull = this.preloadForageFull.bind(this)
    this.getHandler = this.getHandler.bind(this)
    this.renderSighting = this.renderSighting.bind(this)
    this.updateReceiving = this.updateReceiving.bind(this)
  }

  onTag(tagged) {
    this.props.addTargetSighting(fromJS(tagged), this.props.assignment.get('assignment'))
  }

  onNext() {
    this.props.finishAssignment(this.props.assignment)
  }

  onPrev() {
    this.props.getPrevAssignment(this.props.assignment)
  }

  getBase64Image(img) {
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    var dataURL = canvas.toDataURL()

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
  }

  preloadForage(imgUrl) {
    fetch(GROUND_SERVER_URL + imgUrl)
      .then(res => res.blob())
      .then(blob => {
        let theFile = new File([blob], 'toCompress.png', {type: 'image/png'})

        let options = {
          maxSizeMB: 0.5,
          useWebWorker: false,
          exifOrientation: 1 // This is so that it doesn't read the EXIF orientation data
        }

        imageCompression(theFile, options).then(compressedFile => {
          imageCompression.getDataUrlFromFile(compressedFile).then(base64 => {
            localforage.setItem(imgUrl, base64)
          })
        })
      })
  }

  preloadForageFull(imgUrl) {
    var i = new Image()

    // To avoid "tained canvas"/CORS issue
    i.crossOrigin = 'Anonymous'

    var classThis = this
    i.onload = function() {
      var imgData = classThis.getBase64Image(i)
      let imgUrlFull = imgUrl + '_full'
      localforage.setItem(imgUrlFull, imgData)
    }
    i.src = GROUND_SERVER_URL + imgUrl
  }

  getHandler(prop) {
    return e => {
      let propToUpdate = {}
      // for some reason e.target.value is a string so have to cast
      propToUpdate[prop] = Number(e.target.value)
      this.setState(propToUpdate)
    }
  }

  reset() {
    this.setState({
      brightness: 100,
      contrast: 100,
      saturation: 100
    })
  }

  updateReceiving(e) {
    this.props.enableReceiving(e.target.checked)
  }

  componentDidMount() {
    // required to render the sliders properly
    let elems = document.querySelectorAll('input[type=range]')
    M.Range.init(elems, {})

    if (!this.props.assignment.hasIn(['assignment', 'id'])) {
      this.props.getAllAssignments(this.props.assignment.get('currentIndex'))
      this.props.getAllSightings()
    }

    window.addEventListener('load', () => {
      let loadImages = () => {
        let recentImage = this.props.imageState.get('recent')
        this.props.getNewImages((recentImage.get('timestamp') === -1 ? 0 : recentImage.get('id')))
        let images = this.props.imageState.get('all')
        let mostRecentPreloadedId = this.props.imageState.get('lastIdPreloaded')
        images.map((value, key) => {
          if (value.get('id') > mostRecentPreloadedId) {
            let imgUrl = value.get('imageUrl')
            let imgUrlFull = imgUrl + '_full'

            var classThis = this
            // Checking if compressed version has been cached
            localforage.getItem(imgUrl).then(value => {
              if (value === null) {
                classThis.preloadForage(imgUrl)
              }
            })

            // Checking if full/uncompressed version has been cached
            localforage.getItem(imgUrlFull).then(value => {
              if (value === null) {
                classThis.preloadForageFull(imgUrl)
              }
            })

            this.props.preloadImage(value)
          }
          return false
        })
        setTimeout(loadImages, 500)
      }
      loadImages()
    })
  }

  componentDidUpdate(prevProps) {
    M.updateTextFields()

    if (!_.isEqual(prevProps, this.props) &&
      this.props.isReceiving !== this.state.isReceiving) {
      this.setState({
        isReceiving: this.props.isReceiving
      })
    }
  }

  renderSighting(s, isTracking) {
    const imageUrl = this.props.assignment.getIn(['assignment', 'image', 'imageUrl'])
    // TODO once gimbal settings is set in stone do this
    const showOffaxis = /* mode === 'angle' || mode === undefined || mode === null*/ true

    return (
      <TagSighting
        key={s.get('id') + s.get('type') || s.get('localId')}
        sighting={s}
        isTracking={isTracking}
        imageUrl={imageUrl}
        cameraTilt={showOffaxis}
      />
    )
  }

  render() {
    const assignment = this.props.assignment
    const sightings = this.props.sightings

    const mdlcSightings = sightings.filter(
      s => !(s.has('creator')) || s.get('creator').userType !== 'ADLC'
    )

    const preImageUrl = assignment.getIn(['assignment', 'image', 'imageUrl'])

    // extract the gimbalMode to determine if it is an ROI image (if fixed) or regular (tracking)
    const gimbalMode = assignment.getIn(['assignment', 'image', 'imgMode'])
    const isTracking = (gimbalMode && gimbalMode === 'tracking') || !TWO_PASS_MODE
    const name = preImageUrl ? preImageUrl.substring(
      preImageUrl.lastIndexOf('/') + 1,
      preImageUrl.lastIndexOf('.')
    ) + (isTracking ? ' (TARGET)' : ' (ROI)') : ' none'
    const count = (assignment.get('currentIndex') + 1) + '/' + assignment.get('total')
    const btnClass = 'waves-effect waves-light btn-floating btn-large red'
    const backClass = 'prev ' + btnClass + (assignment.get('currentIndex') <= 0 ? ' disabled' : '')
    const nextClass = 'next ' + btnClass + (assignment.get('loading') ? ' disabled' : '')
    return (
      <div className='tag'>
        <div className='flex-row'>
          <ImageTools
            getHandler={this.getHandler}
            reset={this.reset}
            brightness={this.state.brightness}
            contrast={this.state.contrast}
            saturation={this.state.saturation}
          />
          <Switch offState={'Not Receiving'}
            myRef={ref => (this.isReceiving = ref)}
            onChange={this.updateReceiving}
            id={'ad-receiving'}
            checked={this.state.isReceiving}
            onState={'Receiving'}
          />
        </div>
        <div className='detect'>
          <div className='tag-image card'>
            <ImageViewer
              imageUrl={preImageUrl ? preImageUrl : undefined}
              taggable={true}
              onTag={this.onTag}
            />
          </div>
          <div className='name'><span> {name} </span></div>
        </div>
        <div className='classify'>
          <div className='sightings'>
            {mdlcSightings.map(s => this.renderSighting(s, isTracking))}
          </div>
        </div>
        <div className='count'> {count} </div>
        <button className={backClass} onClick={this.onPrev}>
          <i className='material-icons'>arrow_back</i>
        </button>
        <button className={nextClass} onClick={this.onNext}>
          <i className='material-icons'>arrow_forward</i>
        </button>
      </div>
    )
  }
}

const getCurrentAssignment = a => {
  return fromJS({
    assignment: a.getIn(['assignments', a.get('current')]) || null,
    loading: a.get('loading'),
    currentIndex: a.get('current'),
    total: a.get('assignments').size
  })
}

const getSightingsForAssignment = (a, ts) => {
  // grab all target sightings that match the current assignment
  var assignmentId = a.getIn(['assignments', a.get('current'), 'id'])
  return ts
    .get('local')
    .filter(s => s.getIn(['assignment', 'id']) === assignmentId)
    .concat(
      ts.get('saved').filter(s => s.getIn(['assignment', 'id']) === assignmentId)
    )
}

const mapStateToProps = (state) => ({
  assignment: getCurrentAssignment(state.assignmentReducer),
  sightings: getSightingsForAssignment(state.assignmentReducer, state.targetSightingReducer),
  imageState: state.imageReducer,
  isReceiving: state.assignmentReducer.isReceiving
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  addTargetSighting: TargetSightingOperations.addTargetSighting(dispatch),
  getAllSightings: TargetSightingOperations.getAllSightings(dispatch),
  getNewImages: AssignmentOperations.getNewImages(dispatch),
  preloadImage: AssignmentOperations.preloadImage(dispatch),
  getAllAssignments: AssignmentOperations.getAllAssignments(dispatch),
  finishAssignment: AssignmentOperations.finishAssignment(dispatch),
  getPrevAssignment: AssignmentOperations.getPrevAssignment(dispatch),
  enableReceiving: AssignmentOperations.enableReceiving(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Tag)
