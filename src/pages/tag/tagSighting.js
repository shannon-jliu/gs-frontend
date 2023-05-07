import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import M from 'materialize-css'
import _ from 'lodash'
import localforage from 'localforage'

import { AlphanumFields, EmergentFields, ButtonRow, ImageSighting, ShapeTagger } from './components'
import { TypeSelect } from '../../components/target'
import { GROUND_SERVER_URL } from '../../constants/links'
import TargetSightingOperations from '../../operations/targetSightingOperations'

export class TagSighting extends Component {
  constructor(props) {
    super(props)
    const sighting = this.props.sighting.merge(this.props.sighting.get('pending'))
    this.state = {
      type: sighting.get('type') || (this.props.isTracking || this.props.isIntsys ? 'alphanum' : 'roi'),
      description: sighting.get('description') || '',
      shape: sighting.get('shape') || '',
      shapeColor: sighting.get('shapeColor') || '',
      alpha: sighting.get('alpha') || '',
      alphaColor: sighting.get('alphaColor') || '',
      offaxis: sighting.get('offaxis') || false,
      mdlcClassConf: sighting.get('mdlcClassConf') || '',
      points: sighting.get('points')? sighting.get('points').toJS(): [],
      imgSrc: '',
      imgWidth: -1,
      imgHeight: -1,
      compressedWidth: -1,
      compressedHeight: -1,
      shapeCompleted: sighting.get('points') !== undefined
    }
    this.save = this.save.bind(this)
    this.setPoints = this.setPoints.bind(this)
    this.setShapeCompleted = this.setShapeCompleted.bind(this)
    this.canSave = this.canSave.bind(this)
    this.actionable = this.actionable.bind(this)
    this.getHandler = this.getHandler.bind(this)
    this.findDifference = this.findDifference.bind(this)
    this.deleteSighting = this.deleteSighting.bind(this)
    this.isEquiv = this.isEquiv.bind(this)
  }

  setPoints(newPoints) {
    this.setState({ points: newPoints })
  }

  setShapeCompleted(completed) {
    this.setState({ shapeCompleted: completed })
  }

  // checks if the target sighting can be performed on in any way
  actionable() {
    return !this.props.sighting.has('pending')
  }

  // deep equals for array 
  isEquiv = (a, b)=>{
    if(Array.isArray(a) && Array.isArray(b)){
      return (a.length == b.length) && a.every(function(element, index) {
        return element === b[index]; 
      })
    }
    else{
      return a == b
    }
  }

  /* returns the difference between the state and original sighting as immutable obj
    within the given fields */
  findDifference(fields) {
    const s = this.state
    const origSighting = this.props.sighting
    const diffKeys = Object.keys(s).filter(k => fields.includes(k) && !this.isEquiv(s[k], origSighting.get(k)))
    let diffObj = {}
    for (let i = 0; i < diffKeys.length; i++) {
      const key = diffKeys[i]
      diffObj[key] = s[key]
    }
    return fromJS(diffObj)
  }

  canSave() {
    const sighting = this.props.sighting
    // if ROI, no option to update
    if (sighting.get('type') === 'roi' && sighting.has('id')) return false
    // make sure the pending field is not set, otherwise it is saving/updating
    if (this.actionable()) {
      const s = this.state
      if (s.type === 'roi') return true
      if (s.type === 'emergent') {
        return (s.description.length > 0 &&
        s.mdlcClassConf.length > 0 &&
        !_.isEqual(
          _.pick(s, ['description', 'mdlcClassConf']),
          _.pick(sighting.toJS(), ['description', 'mdlcClassConf'])
        ))
      }
      if (s.type === 'alphanum') {
        return (
          (!this.props.isIntsys || this.state.shapeCompleted) &&
          s.shape.length > 0 &&
          s.shapeColor.length > 0 &&
          s.alpha.length > 0 &&
          s.alphaColor.length > 0 &&
          s.mdlcClassConf.length > 0 &&
          (!_.isEqual(
            _.pick(s, [
              'shape',
              'shapeColor',
              'alpha',
              'alphaColor',
              'offaxis',
              'mdlcClassConf'
            ]),
            _.pick(sighting.toJS(), [
              'shape',
              'shapeColor',
              'alpha',
              'alphaColor',
              'offaxis',
              'mdlcClassConf'
            ])
          ) || !this.isEquiv(s['points'], sighting.toJS()['points']))

        )
      }
    }
    return false
  }

  componentDidMount() {
    /* required for selectors.
      See: https://materializecss.com/select.html#initialization */
    let elems = document.querySelectorAll('select')
    M.FormSelect.init(elems, {})

    this.loadImage(this.props.imageUrl)
  }

  componentWillReceiveProps(nextProps) {
    const sighting = nextProps.sighting.merge(nextProps.sighting.get('pending'))
    const prevType = this.state.type ? this.state.type : 'alphanum'
    this.setState({
      shape: sighting.get('shape') || '',
      shapeColor: sighting.get('shapeColor') || '',
      alpha: sighting.get('alpha') || '',
      alphaColor: sighting.get('alphaColor') || '',
      type: sighting.get('type') || prevType,
      description: sighting.get('description') || '',
      mdlcClassConf: sighting.get('mdlcClassConf') || '',
      offaxis: sighting.get('offaxis') || false,
      points: sighting.get('points')? sighting.get('points').toJS(): []
    })
    this.loadImage(nextProps.imageUrl)
  }

  // Sets local target sighting attributes to values in fields
  getHandler(prop) {
    return e => {
      let newState = {}
      let val
      if (e.target.type === 'checkbox') {
        val = e.target.checked
      } else {
        val = e.target.value
      }
      if (prop === 'alpha') {
        // Keeps alphanum input at one character
        val = val.slice(0, 1).toUpperCase()
      } else if (prop === 'description') {
        val = val.slice(0, 100)
      }
      newState[prop] = val
      this.setState(newState)
    }
  }

  loadImage(imageUrl) {
    let i = new Image()
    i.onload = () => {
      this.setState({
        imgSrc: i.src,
        imgWidth: i.width,
        imgHeight: i.height
      })
    }

    let imgUrlFull = imageUrl + '_full'
    i.src = GROUND_SERVER_URL + imageUrl
  }

  save(e) {
    e.preventDefault();
    const s = this.state
    if (this.canSave()) {
      if (s.type === 'roi') {
        this.props.saveROISighting(this.props.sighting)
      } else {
        // adds fields listed and saves the target sighting
        let newSighting, attr
        if (s.type === 'emergent') {
          newSighting = this.props.sighting.merge({
            type: s.type,
            description: s.description,
            mdlcClassConf: s.mdlcClassConf
          })
          attr = this.findDifference(['description', 'mdlcClassConf'])
        } else if (s.type === 'alphanum') {
          newSighting = this.props.sighting.merge({
            type: s.type,
            shape: s.shape,
            shapeColor: s.shapeColor,
            alpha: s.alpha,
            alphaColor: s.alphaColor,
            offaxis: s.offaxis,
            mdlcClassConf: s.mdlcClassConf,
            points: s.points
          })
          attr = this.findDifference([
            'shape',
            'shapeColor',
            'alpha',
            'alphaColor',
            'offaxis',
            'mdlcClassConf',
            'points'
          ])
        }
        if (this.props.sighting.has('id')) {
          // if it has an id, then it has been saved and needs to be updated
          this.props.updateTargetSighting(this.props.sighting, attr)
        } else {
          this.props.saveTargetSighting(newSighting)
        }
      }
    }
  }

  deleteSighting(e) {
    e.preventDefault();
    if (this.actionable()) {
      if (this.props.sighting.has('id')) {
        if (this.state.type === 'roi') this.props.deleteSavedROISighting(this.props.sighting)
        else this.props.deleteSavedTargetSighting(this.props.sighting)
      } else {
        this.props.deleteUnsavedTargetSighting(this.props.sighting)
      }
    }
  }

  render() {
    const height_width = 315
    return (
      <div className={this.state.saved ? 'hidden' : 'sighting card'}>

        {this.props.isIntsys ?
          <ShapeTagger
            heightWidth={height_width}
            imageUrl={this.state.imgSrc}
            imgWidth={this.state.imgWidth}
            imgHeight={this.state.imgHeight}
            sighting={this.props.sighting}
            points={this.state.points}
            setPoints={this.setPoints}
            completed={this.state.shapeCompleted}
            setCompleted={this.setShapeCompleted}
          /> :
          <ImageSighting
            heightWidth={height_width}
            imageUrl={this.state.imgSrc}
            imgWidth={this.state.imgWidth}
            imgHeight={this.state.imgHeight}
            sighting={this.props.sighting}
          />}

        <div className={this.props.sighting.has('id') ? 'hidden' : 'row'}>
          <TypeSelect
            className='obj col s12'
            onChange={this.getHandler('type')}
            title='Target Type'
            value={this.state.type}
          />
        </div>

        <div className={this.state.type === 'alphanum' ? '' : 'hidden'}>
          <AlphanumFields
            shape={this.state.shape}
            shapeColor={this.state.shapeColor}
            alpha={this.state.alpha}
            alphaColor={this.state.alphaColor}
            cameraTilt={this.props.cameraTilt}
            isOffAxis={this.state.offaxis}
            confidence={this.state.mdlcClassConf}
            getHandler={this.getHandler}
          />
        </div>

        <div className={this.state.type === 'emergent' ? '' : 'hidden'}>
          <EmergentFields
            description={this.state.description}
            confidence={this.state.mdlcClassConf}
            getHandler={this.getHandler}
          />
        </div>

        {/* TypeSelect still allows users to select no type, so this line is still rqeuired */}
        <div className={this.state.type !== '' ? 'row' : 'hidden'}>
          <ButtonRow
            type={this.state.type}
            isSaved={this.props.sighting.has('id')}
            saveable={this.canSave()}
            save={this.save}
            deletable={this.actionable()}
            deleteSighting={this.deleteSighting}
          />
        </div>
      </div>
    )
  }
}

TagSighting.propTypes = {
  sighting: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
  isTracking: PropTypes.bool.isRequired, // if true, then target, else ROI
  cameraTilt: PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveTargetSighting: TargetSightingOperations.saveTargetSighting(dispatch),
  updateTargetSighting: TargetSightingOperations.updateTargetSighting(dispatch),
  deleteUnsavedTargetSighting: TargetSightingOperations.deleteUnsavedTargetSighting(dispatch),
  deleteSavedTargetSighting: TargetSightingOperations.deleteSavedTargetSighting(dispatch),
  saveROISighting: TargetSightingOperations.saveROISighting(dispatch),
  deleteSavedROISighting: TargetSightingOperations.deleteSavedROISighting(dispatch)
})

export default connect(null, mapDispatchToProps)(TagSighting)
