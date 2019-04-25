import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import { fromJS } from 'immutable'
import M from 'materialize-css'
import _ from 'lodash'

import { TargetAlphanumFields, TargetEmergentFields, TargetGeotagFields, TargetButtonRow } from './components'
import MergeSightingPreview from './mergeSightingPreview.js'
import TargetOperations from '../../operations/targetOperations'

export class MergeTarget extends Component {
  constructor(props) {
    super(props)
    let t = this.props.target
    if (t.has('pending')) {
      t = t.merge(t.get('pending'))
    }

    this.state = {
      shape: t.get('shape') || '',
      shapeColor: t.get('shapeColor') || '',
      alpha: t.get('alpha') || '',
      alphaColor: t.get('alphaColor') || '',
      thumbnailTSId: t.get('thumbnailTSId') || 0,
      description: t.get('description') || '',
      longitude: t.getIn(['geotag', 'gpsLocation', 'longitude']) || '',
      latitude: t.getIn(['geotag', 'gpsLocation', 'latitude']) || '',
      dragCtr: 0, //counter rather than boolean to allow hovering over child elements
      iwidth: -1,
      iheight: -1
    }

    this.canDelete = this.canDelete.bind(this)
    this.canSave = this.canSave.bind(this)
    this.getHandler = this.getHandler.bind(this)
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
    this.dragEnter = this.dragEnter.bind(this)
    this.dragLeave = this.dragLeave.bind(this)
    this.drop = this.drop.bind(this)
    this.selectThumb = this.selectThumb.bind(this)
  }

  componentDidMount() {
    // required for selectors.
    // See: https://materializecss.com/select.html#initialization
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems, {})
  }

  componentWillReceiveProps(nextProps) {
    //update attributes changed from props to nextProps but unchanged from props to state
    //don't need to merge in pending fields, because those fields must have already been changed on page
    const changedState = this.props.target
      .filter((val, key) => this.state[key] === val && nextProps.target.get(key) !== val)
      .map((_, key) => nextProps.target.get(key)).toJSON()
    this.setState(changedState)
  }

  canDelete() {
    return !this.props.target.has('pending')
  }

  canSave() {
    const s = this.state
    const t = this.props.target

    if (t.has('pending')) {
      return false
    }

    const allValid =
      (t.get('type') === 'alphanum' &&
        s.shape.length > 0 &&
        s.shapeColor.length > 0 &&
        s.alpha.length > 0 &&
        s.alphaColor.length > 0) ||
      (t.get('type') === 'emergent' &&
        s.description.length > 0)

    const isGeotagValid = () =>
      (s.latitude === '' && s.longitude === '') ||
      (!_.isNaN(s.latitude) && !_.isNaN(s.longitude) &&
        Math.abs(parseFloat(s.longitude)) <= 180 &&
        Math.abs(parseFloat(s.latitude)) <= 90)

    const fieldsHaveChanged = () =>
      (t.get('type') === 'alphanum' &&
        !_.isEqual(
          _.pick(s, [
            'shape',
            'shapeColor',
            'alpha',
            'alphaColor',
            'thumbnailTSId'
          ]),
          _.pick(t.toJS(), [
            'shape',
            'shapeColor',
            'alpha',
            'alphaColor',
            'thumbnailTSId'
          ]))) ||
      (t.get('type') === 'emergent' &&
        !_.isEqual(
          _.pick(s, [
            'description',
            'thumbnailTSId'
          ]),
          _.pick(t.toJS(), [
            'description',
            'thumbnailTSId'
          ])))

    //don't need to check isNaN because isGeotagValid() must have already returned true
    const geotagHasChanged = () =>
      s.latitude !== '' && s.longitude !== '' && 
        (!t.hasIn(['geotag', 'gpsLocation', 'latitude']) ||
        !t.hasIn(['geotag', 'gpsLocation', 'longitude']) ||
        t.getIn(['geotag', 'gpsLocation', 'latitude']) != s.latitude ||
        t.getIn(['geotag', 'gpsLocation', 'longitude']) != s.longitude)

    return allValid && isGeotagValid() && (fieldsHaveChanged() || geotagHasChanged())
  }

  getHandler(prop) {
    return e => {
      let o = {}
      let val = e.target.value
      if (prop === 'alpha') {
        val = val.slice(0, 1).toUpperCase()
      }
      o[prop] = val
      this.setState(o)
    }
  }

  save() {
    if (this.canSave()) {
      const s = this.state
      const t = this.props.target

      const validFields = ['thumbnailTSId']
      const validEmergentFields = ['description']
      const validAlphanumFields = ['shape', 'shapeColor', 'alpha', 'alphaColor']

      let newVals = fromJS(_.pick(s, _.concat(validFields, t.get('type') == 'alphanum' ? validAlphanumFields : validEmergentFields)))
        .filter((value, key) => t.get(key) != value)

      if (s.longitude !== '' && s.latitude !== '' && 
          (t.getIn(['geotag', 'gpsLocation', 'longitude']) !== s.longitude || 
          t.getIn(['geotag', 'gpsLocation', 'latitude']) !== s.latitude)) {
        newVals = newVals.set('geotag', fromJS({
          gpsLocation: {
            longitude: s.longitude,
            latitude: s.latitude
          }
        }))
      }

      if (t.has('id')) {
        this.props.updateTarget(t, newVals)
      } else {
        this.props.saveTarget(t.merge(newVals), fromJS([]))
      }
    }
  }

  delete() {
    if (this.canDelete()) {
      if (this.props.target.has('id')) {
        this.props.deleteSavedTarget(this.props.target)
      } else {
        this.props.deleteUnsavedTarget(this.props.target)
      }
    }
  }

  dragEnter(e) {
    this.setState({
      dragCtr: this.state.dragCtr + 1
    })
  }

  dragLeave(e) {
    this.setState({
      dragCtr: this.state.dragCtr - 1
    })
  }

  drop(e) {
    this.setState({
      dragCtr: 0
    })
    this.props.onTsDrop(this.props.target)
  }

  selectThumb(tsId) {
    this.setState({ thumbnailTSId: tsId })
  }

  render() {
    const t = this.props.target

    const canHoldTs = t.get('type') === 'emergent' || t.get('offaxis') || !t.has('id')
    return (
      <div
        ref='main'
        className={'target card' + (this.state.dragCtr > 0 ? ' drag-over' : '')}
        onDragEnter={canHoldTs ? undefined : this.dragEnter}
        onDragLeave={canHoldTs ? undefined : this.dragLeave}
        onDragOver={canHoldTs ? undefined : e => e.preventDefault()}
        onDrop={canHoldTs ? undefined : this.drop}
      >
        <div className='facts'>
          <div className={t.get('type') === 'alphanum' ? 'row' : 'hidden'}> 
            <TargetAlphanumFields
              shape={this.state.shape}
              shapeColor={this.state.shapeColor}
              alpha={this.state.alpha}
              alphaColor={this.state.alphaColor}
              getHandler={this.getHandler}
            />
          </div>

          <div className={t.get('type') === 'emergent' ? 'row' : 'hidden'}> 
            <TargetEmergentFields
              description={this.state.description}
              getHandler={this.getHandler}
            />
          </div>

          <div className={t.get('type') === 'emergent' || !t.get('offaxis') ? 'row' : 'hidden'}>
            <TargetGeotagFields
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              getHandler={this.getHandler}
            />
          </div>

          <TargetButtonRow
            type={t.get('type')}
            offaxis={t.get('offaxis')}
            isSaved={t.has('id')}
            saveable={this.canSave()}
            save={this.save}
            deletable={this.canDelete()}
            deleteFn={this.delete}
          />
        </div>
        {/*All images from target sightings */}
        <div className='sighting-images'>
          {this.props.sightings.map(ts => (
            <MergeSightingPreview
              key={ts.get('id') + '-image-' + ts.get('type')}
              onClick={() => this.selectThumb(ts.get('id'))}
              isThumbnail={ts.get('id') == this.state.thumbnailTSId}
              isMerged={true}
              sighting={ts}
              onDragStart={
                t.get('type') === 'emergent' || t.get('offaxis')
                  ? undefined : () => this.props.onTsDragStart(ts)
              }
              onDragEnd={
                t.get('type') === 'emergent' || t.get('offaxis')
                  ? undefined : this.props.onTsDragEnd
              }
              dragging={t.get('type') == 'alphanum' && ts.get('id') === this.props.dragId}
            />
          )).toJSON() /*toJSON is a shallow conversion while toJS is deep */}
        </div>
      </div>
    )
  }
}

MergeTarget.propTypes = {
  target: ImmutablePropTypes.map.isRequired,
  sightings: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired, //all sightings bound to the target
  onTsDragStart: PropTypes.func.isRequired,
  onTsDragEnd: PropTypes.func.isRequired,
  onTsDrop: PropTypes.func.isRequired,
  dragId: PropTypes.number
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveTarget: TargetOperations.saveTarget(dispatch),
  updateTarget: TargetOperations.updateTarget(dispatch),
  deleteSavedTarget: TargetOperations.deleteSavedTarget(dispatch),
  deleteUnsavedTarget: TargetOperations.deleteUnsavedTarget(dispatch)
})

export default connect(null, mapDispatchToProps)(MergeTarget)
