import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import M from 'materialize-css'
import _ from 'lodash'

import SnackbarUtil from '../../util/snackbarUtil.js'
import { AlphanumFields, EmergentFields, ButtonRow, ImageSighting } from './components'
import { ColorSelect, ShapeSelect, TypeSelect, ConfSelect } from '../../components/target'
import TargetSightingOperations from '../../operations/targetSightingOperations'

export class TagSighting extends Component {
  constructor(props) {
    super(props)
    const sighting = this.props.sighting.merge(this.props.sighting.get('pending'))
    this.state = {
      type: sighting.get('type') || 'alphanum',
      description: sighting.get('description') || '',
      shape: sighting.get('shape') || '',
      shapeColor: sighting.get('shapeColor') || '',
      alpha: sighting.get('alpha') || '',
      alphaColor: sighting.get('alphaColor') || '',
      offaxis: sighting.get('offaxis') || false,
      mdlcClassConf: sighting.get('mdlcClassConf') || '',
      imgWidth: -1,
      imgHeight: -1
    }
    this.save = this.save.bind(this)
    this.canSave = this.canSave.bind(this)
    this.actionable = this.actionable.bind(this)
    this.getHandler = this.getHandler.bind(this)
    this.findDifference = this.findDifference.bind(this)
    this.deleteSighting = this.deleteSighting.bind(this)
  }

  // checks if the target sighting can be performed on in any way
  actionable() {
    return !this.props.sighting.has('pending')
  }

  // returns the difference between the state and original sighting as immutable obj
  // within the given fields
  findDifference(fields) {
    const s = this.state
    const origSighting = this.props.sighting
    const diffKeys = Object.keys(s).filter(k => fields.includes(k) && s[k] != origSighting.get(k))
    let diffObj = {}
    for (let i = 0; i < diffKeys.length; i++) {
      const key = diffKeys[i]
      diffObj[key] = s[key]
    }
    return fromJS(diffObj)
  }

  canSave() {
    // make sure the pending field is not set, otherwise it is saving/updating
    if (this.actionable()) {
      const s = this.state
      if (s.type == 'emergent') {
        return (s.description.length > 0 &&
        s.mdlcClassConf.length > 0 &&
        !_.isEqual(
          _.pick(s, ['description', 'mdlcClassConf']),
          _.pick(this.props.sighting.toJS(), ['description', 'mdlcClassConf'])
        ))
      }
      if (s.type == 'alphanum') {
        return (
          s.shape.length > 0 &&
          s.shapeColor.length > 0 &&
          s.alpha.length > 0 &&
          s.alphaColor.length > 0 &&
          s.mdlcClassConf.length > 0 &&
          !_.isEqual(
            _.pick(s, [
              'shape',
              'shapeColor',
              'alpha',
              'alphaColor',
              'offaxis',
              'mdlcClassConf'
            ]),
            _.pick(this.props.sighting.toJS(), [
              'shape',
              'shapeColor',
              'alpha',
              'alphaColor',
              'offaxis',
              'mdlcClassConf'
            ])
          )
        )
      }
    }
    return false
  }

  componentWillMount() {
    // required for selectors.
    // See: https://materializecss.com/select.html#initialization
    document.addEventListener('DOMContentLoaded', () => {
      let elems = document.querySelectorAll('select')
      let instances = M.FormSelect.init(elems, {})
    })
  }

  componentDidMount() {
    this.loadImage(this.props.imageUrl)
  }

  componentWillReceiveProps(nextProps) {
    const sighting = nextProps.sighting.merge(nextProps.sighting.get('pending'))
    this.setState({
      shape: sighting.get('shape') || '',
      shapeColor: sighting.get('shapeColor') || '',
      alpha: sighting.get('alpha') || '',
      alphaColor: sighting.get('alphaColor') || '',
      type: sighting.get('type') || 'alphanum',
      description: sighting.get('description') || '',
      mdlcClassConf: sighting.get('mdlcClassConf') || '',
      offaxis: sighting.get('offaxis') || false
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
        //Keeps alphanum input at one character
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
        imgWidth: i.width,
        imgHeight: i.height
      })
    }
    i.src = imageUrl
  }

  save() {
    const s = this.state
    if (this.canSave()) {
      // adds fields listed and saves the target sighting
      let newSighting, attr
      if (s.type == 'emergent') {
        newSighting = this.props.sighting.merge({
          type: s.type,
          description: s.description,
          mdlcClassConf: s.mdlcClassConf
        })
        attr = this.findDifference(['description', 'mdlcClassConf'])
      } else if (s.type == 'alphanum') {
        newSighting = this.props.sighting.merge({
          type: s.type,
          shape: s.shape,
          shapeColor: s.shapeColor,
          alpha: s.alpha,
          alphaColor: s.alphaColor,
          offaxis: s.offaxis,
          mdlcClassConf: s.mdlcClassConf
        })
        attr = this.findDifference([
          'shape',
          'shapeColor',
          'alpha',
          'alphaColor',
          'offaxis',
          'mdlcClassConf'
        ])
      }
      if (this.props.sighting.has('id')) {
        // if it has an id, then it has been saved and needs to be update
        this.props.updateTargetSighting(this.props.sighting, fromJS(attr))
      } else {
        this.props.saveTargetSighting(newSighting)
      }
    }
  }

  deleteSighting() {
    if(this.actionable()) {
      if (this.props.sighting.has('id')) {
        this.props.deleteSavedTargetSighting(this.props.sighting)
      } else {
        this.props.deleteUnsavedTargetSighting(this.props.sighting)
      }
    }
  }

  render() {
    const height_width = 300
    return (
      <div className={this.state.saved ? 'hidden' : 'sighting card'}>
        <ImageSighting
          heightWidth={height_width}
          imgWidth={this.state.imgWidth}
          imgHeight={this.state.imgHeight}
          imageUrl={this.props.imageUrl}
          sighting={this.props.sighting}
        />

        <div className={this.props.sighting.has('id') ? 'hidden' : 'row'}>
          <TypeSelect
            className='obj col s12'
            onChange={this.getHandler('type')}
            title='Target Type'
            value={this.state.type}
          />
        </div>

        <div className={this.state.type == 'alphanum' ? 'row' : 'hidden'}>
          <AlphanumFields
            shape={this.state.shape}
            shapeColor={this.state.shapeColor}
            alpha={this.state.alpha}
            alphaColor={this.state.alphaColor}
            cameraTilt={true}
            isOffAxis={this.state.offaxis}
            getHandler={this.getHandler}
          />
        </div>

        <div className={this.state.type == 'emergent' ? 'row' : 'hidden'}>
          <EmergentFields
            description={this.state.description}
            getHandler={this.getHandler}
          />
        </div>

        <div className={this.state.type != '' ? 'row' : 'hidden'}>
          <ConfSelect
            className='obj col s12'
            onChange={this.getHandler('mdlcClassConf')}
            title='Confidence'
            value={this.state.mdlcClassConf}
          />
        </div>

        <div className={this.state.type != '' ? 'row' : 'hidden'}>
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
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveTargetSighting: sighting => TargetSightingOperations.saveTargetSighting(dispatch)(fromJS(sighting)),
  updateTargetSighting: sighting => TargetSightingOperations.updateTargetSighting(dispatch)(fromJS(sighting)),
  deleteUnsavedTargetSighting: sighting => TargetSightingOperations.deleteUnsavedTargetSighting(dispatch)(fromJS(sighting)),
  deleteSavedTargetSighting: sighting => TargetSightingOperations.deleteSavedTargetSighting(dispatch)(fromJS(sighting))
})

export default connect(null, mapDispatchToProps)(TagSighting)