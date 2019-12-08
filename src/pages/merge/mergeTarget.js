import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import { fromJS } from 'immutable'
import M from 'materialize-css'
import _ from 'lodash'
import classNames from 'classnames'

import { TargetAlphanumFields, TargetEmergentFields, TargetGeotagFields, TargetButtonRow } from './components'
import MergeSightingCluster from './mergeSightingCluster'
import TargetOperations from '../../operations/targetOperations'
import SnackbarUtil from '../../util/snackbarUtil.js'
import { NENO_COORDS, PAX_COORDS } from '../../constants/constants.js'
import TargetSightingClusterOperations from '../../operations/targetSightingClusterOperations'

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
      dragHover: 0,
      iwidth: -1,
      iheight: -1
    }

    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)

    this.canSave = this.canSave.bind(this)
    this.canDelete = this.canDelete.bind(this)

    this.getHandler = this.getHandler.bind(this)

    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)

    this.selectThumb = this.selectThumb.bind(this)
  }

  componentDidMount() {
    // required for selectors.
    // See: https://materializecss.com/select.html#initialization
    let elems = document.querySelectorAll('select')
    M.FormSelect.init(elems, {})
  }

  componentWillReceiveProps(nextProps) {
    //update attributes changed from props to nextProps but unchanged from props to state
    //don't need to merge in pending fields, because those fields must have already been changed on page
    const changedState = this.props.target
      .filter((val, key) => this.state[key] === val && nextProps.target.get(key) !== val)
      .map((_, key) => nextProps.target.get(key)).toJSON()
    this.setState(changedState)
  }

  canDelete(showReason) {
    if (showReason && this.props.target.has('pending')) SnackbarUtil.render('Cannot delete target: target is currently saving')
    return !this.props.target.has('pending')
  }

  canSave(showReason) {
    const s = this.state
    const t = this.props.target

    if (t.has('pending')) {
      if (showReason) SnackbarUtil.render('Cannot save target: target is currently saving')
      return false
    }

    const allValid =
      (t.get('type') === 'alphanum' &&
        s.shape &&
        s.shapeColor &&
        s.alpha &&
        s.alphaColor) ||
      (t.get('type') === 'emergent' &&
        s.description.length > 0)

    if (!allValid) {
      if (showReason) {
        if (t.get('type') === 'alphanum') {
          if (!s.shape) {
            SnackbarUtil.render('Cannot save target: shape field is not set')
          } else if (!s.shapeColor) {
            SnackbarUtil.render('Cannot save target: shape color field is not set')
          } else if (!s.alpha) {
            SnackbarUtil.render('Cannot save target: alpha field is empty')
          } else if (!s.alphaColor) {
            SnackbarUtil.render('Cannot save target: alpha color field is not set')
          }
        } else {
          SnackbarUtil.render('Cannot save target: description is empty')
        }
      }
      return false
    }

    //0.5 degrees of latitude is longitude is 25-35 miles -- should be used as a sanity check, not a guarantee within bounds
    const isGeotagValid =
      (s.latitude === '' && s.longitude === '') ||
      (!_.isNaN(parseFloat(s.latitude)) && !_.isNaN(parseFloat(s.longitude)) &&
        (Math.abs(parseFloat(s.latitude) - PAX_COORDS[0]) < 0.5 && Math.abs(parseFloat(s.longitude) - PAX_COORDS[1]) < 0.5)) ||
      (Math.abs(parseFloat(s.latitude) - NENO_COORDS[0]) < 0.5 && Math.abs(parseFloat(s.longitude) - NENO_COORDS[1]) < 0.5)

    if (!isGeotagValid) {
      if (showReason) {
        if (s.latitude === '' || s.longitude === '') {
          SnackbarUtil.render('Cannot save target: only one lat/long field is set (both can be empty)')
        } else if (_.isNaN(parseFloat(s.latitude))) {
          SnackbarUtil.render('Cannot save target: latitude is not a number')
        } else if (_.isNaN(parseFloat(s.longitude))) {
          SnackbarUtil.render('Cannot save target: longitude is not a number')
        } else {
          SnackbarUtil.render('Cannot save target: geotag not near PAX (lat: ' + PAX_COORDS[0] +
            ', long: ' + PAX_COORDS[1] + ') or Neno (lat: ' + NENO_COORDS[0] + ', long: ' + NENO_COORDS[1] + ')')
        }
      }
      return false
    }

    const fieldsHaveChanged =
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

    if (fieldsHaveChanged) return true

    //don't need to check isNaN because isGeotagValid must have already be true
    const geotagHasChanged =
      s.latitude !== '' && s.longitude !== '' &&
      (!t.hasIn(['geotag', 'gpsLocation', 'latitude']) ||
        !t.hasIn(['geotag', 'gpsLocation', 'longitude']) ||
        t.getIn(['geotag', 'gpsLocation', 'latitude']) !== s.latitude ||
        t.getIn(['geotag', 'gpsLocation', 'longitude']) !== s.longitude)

    if (geotagHasChanged) return true

    if (showReason) {
      if (t.get('type') === 'alphanum') SnackbarUtil.render('Cannot save target: no field/thumbnail/geotag changes to save')
      else SnackbarUtil.render('Cannot save target: no description/thumbnail/geotag changes to save')
    }

    return false
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
    if (this.canSave(true)) {
      const s = this.state
      const t = this.props.target

      const validFields = ['thumbnailTSId']
      const validEmergentFields = ['description']
      const validAlphanumFields = ['shape', 'shapeColor', 'alpha', 'alphaColor']

      let newVals = fromJS(_.pick(s, _.concat(validFields, t.get('type') === 'alphanum' ? validAlphanumFields : validEmergentFields)))
        .filter((value, key) => t.get(key) !== value)

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
    if (this.canDelete(true)) {
      if (this.props.target.has('id')) {
        this.props.deleteSavedTarget(this.props.target)
      } else {
        this.props.deleteUnsavedTarget(this.props.target)
      }
    }
  }

  onDragEnter(e) {
    // can't inspect the actual contents of event until drop() due to security restrictions
    // https://stackoverflow.com/questions/28487352/dragndrop-datatransfer-getdata-empty
    // so just check mime type
    if (!e.dataTransfer.types.includes('application/json+cluster'))
      return

    // increment counter for child element
    this.setState({ dragHover: this.state.dragHover + 1 })

    e.preventDefault()
  }

  onDragOver(e) {
    if (!e.dataTransfer.types.includes('application/json+cluster'))
      return

    e.preventDefault()
  }

  onDragLeave() {
    this.setState({ dragHover: this.state.dragHover - 1 })
  }

  /**
   * @param {DragEvent} e 
   */
  onDrop(e) {
    if (!e.dataTransfer.types.includes('application/json+cluster')) return

    const data = e.dataTransfer.getData('application/json+cluster')
    if (_.isEmpty(data)) return

    const cluster = fromJS(JSON.parse(data))
    const target = this.props.target
    if (_.isNil(cluster) || cluster.get('type') !== target.get('type')) return

    e.preventDefault()

    this.setState({ dragHover: 0 })
    this.props.updateCluster(cluster, { targetId: target.get('id') })
  }

  selectThumb(tsId) {
    this.setState({ thumbnailTSId: tsId })
  }

  render() {
    const t = this.props.target

    //both for whether ts can be dragged in and whether it has title
    const canAddCluster = t.has('id') && !t.get('offaxis') && t.get('type') !== 'emergent'
    const targetType = t.get('offaxis') ? 'offaxis' :
      !t.has('id') ? 'unsaved' :
        t.get('type')

    const getAlphanumTitle = (t) => {
      const shape = _.capitalize(t.get('shape'))
      const shapeColor = _.capitalize(t.get('shapeColor'))
      const alpha = _.capitalize(t.get('alpha'))
      const alphaColor = _.capitalize(t.get('alphaColor'))
      return `${shapeColor} ${shape}, ${alphaColor} ${alpha}`
    }

    return (
      <div
        ref='main'
        className={'merge-target'}
        onDragEnter={canAddCluster ? this.onDragEnter : undefined}
        onDragOver={canAddCluster ? this.onDragOver : undefined}
        onDragLeave={canAddCluster ? this.onDragLeave : undefined}
        onDrop={canAddCluster ? this.onDrop : undefined}
      >
        <div className={classNames('merge-cluster-drop-overlay', { active: this.state.dragHover > 0 })}>
          <p>✔️</p>
        </div>
        <div className={classNames('merge-target-type', 'merge-target-type-' + targetType)}>
          {targetType === 'alphanum' ? getAlphanumTitle(t) : targetType}
        </div>
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
        <ul className='merge-target-clusters'>
          {this.props.clusters.map(cluster => (
            <MergeSightingCluster
              key={cluster.get('id')}
              cluster={cluster}
              isMerged={true}
            />
          )).toJSON() /*toJSON is a shallow conversion while toJS is deep */}
        </ul>
      </div>
    )
  }
}

MergeTarget.propTypes = {
  target: ImmutablePropTypes.map.isRequired,
  clusters: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired, //all clusters bound to the target
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveTarget: TargetOperations.saveTarget(dispatch),
  updateTarget: TargetOperations.updateTarget(dispatch),
  deleteSavedTarget: TargetOperations.deleteSavedTarget(dispatch),
  deleteUnsavedTarget: TargetOperations.deleteUnsavedTarget(dispatch),
  updateCluster: TargetSightingClusterOperations.updateCluster(dispatch),

})

export default connect(null, mapDispatchToProps)(MergeTarget)
