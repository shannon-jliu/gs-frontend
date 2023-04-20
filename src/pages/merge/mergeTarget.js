import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import { fromJS } from 'immutable'
import M from 'materialize-css'
import _ from 'lodash'

import {
  TargetAlphanumFields,
  TargetEmergentFields,
  TargetGeotagFields,
  TargetButtonRow,
} from './components'
import MergeSightingPreview from './mergeSightingPreview.js'
import TargetOperations from '../../operations/targetOperations'
import SnackbarUtil from '../../util/snackbarUtil.js'
import { NENO_COORDS, PAX_COORDS } from '../../constants/constants.js'
import { GROUND_SERVER_URL } from '../../constants/links'

export class MergeTarget extends Component {
  constructor(props) {
    super(props)

    const t = this.getAssumedTargetFromProps()

    this.state = {
      shape: t.get('shape') || '',
      shapeColor: t.get('shapeColor') || '',
      alpha: t.get('alpha') || '',
      alphaColor: t.get('alphaColor') || '',
      thumbnailTsid: t.get('thumbnailTsid') || 0,
      description: t.get('description') || '',
      longitude: t.getIn(['geotag', 'gpsLocation', 'longitude']) || '',
      latitude: t.getIn(['geotag', 'gpsLocation', 'latitude']) || '',
      dragCtr: 0, //counter rather than boolean to allow hovering over child elements
      iwidth: -1,
      iheight: -1,
    }

    this.canDelete = this.canDelete.bind(this)
    this.canSave = this.canSave.bind(this)
    this.getHandler = this.getHandler.bind(this)
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
    this.dragEnter = this.dragEnter.bind(this)
    this.dragLeave = this.dragLeave.bind(this)
    this.drop = this.drop.bind(this)
    this.renderSightingPreview = this.renderSightingPreview.bind(this)
    this.selectSightingAsThumbnail = this.selectSightingAsThumbnail.bind(this)
    this.sendToAutopilot = this.sendToAutopilot.bind(this)
  }

  getAssumedTargetFromProps() {
    let t = this.props.target
    if (t.has('pending')) {
      t = t.merge(t.get('pending'))
    }
    return t
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
      .filter(
        (val, key) =>
          this.state[key] === val && nextProps.target.get(key) !== val
      )
      .map((_, key) => nextProps.target.get(key))
      .toJSON()
    this.setState(changedState)
  }

  render() {
    const targetHasSpecialType = this.isTargetTypeSpecial()
    return (
      <div
        ref="main"
        className={'target card' + (this.state.dragCtr > 0 ? ' drag-over' : '')}
        onDragEnter={targetHasSpecialType ? undefined : this.dragEnter}
        onDragLeave={targetHasSpecialType ? undefined : this.dragLeave}
        onDragOver={
          targetHasSpecialType ? undefined : (e) => e.preventDefault()
        }
        onDrop={targetHasSpecialType ? undefined : this.drop}
      >
        {this.renderTitleIfSpecialType()}
        {this.renderAttributesSection()}
        {this.renderSightingPreviewRow()}
      </div>
    )
  }

  renderTitleIfSpecialType() {
    return (
      <div className={'type' + (this.isTargetTypeSpecial() ? '' : ' hidden')}>
        {this.getTargetTypeDisplayTitleIfSpecial()}
        <div className="border"></div>
      </div>
    )
  }

  getTargetTypeDisplayTitleIfSpecial() {
    if (this.props.target.get('type') === 'emergent') {
      return 'Emergent'
    } else if (this.props.target.get('offaxis')) {
      return 'Off-axis'
    } else if (!this.props.target.has('id')) {
      return 'Unsaved'
    } else {
      return ''
    }
  }

  renderAttributesSection() {
    if (this.props.target.get('type') == 'emergent') {
      return (
        <div className="facts-emergent">
          {this.renderClassificationFields()}
          {this.renderGeotagFieldsIfApplicable()}
          {this.renderButtons()}
        </div>
      )
    }
    return (
      <div className="facts">
        {this.renderClassificationFields()}
        {this.renderGeotagFieldsIfApplicable()}
        {this.renderButtons()}
      </div>
    )
  }

  renderClassificationFields() {
    let fields
    if (this.props.target.get('type') === 'alphanum') {
      fields = this.renderAlphanumClassificationFields()
    } else if (this.props.target.get('type') === 'emergent') {
      fields = this.renderEmergentClassificationFields()
    } else {
      fields =
        'ERROR: target not alphanum or emergent, cannot render fields (please tell someone on Platform this)'
    }

    return <div className="row">{fields}</div>
  }

  renderAlphanumClassificationFields() {
    let alpha = this.props.target.get('alpha')
    let alphaColor = (shape = this.props.target.get('alphaColor'))
    let shape = this.props.target.get('shape').toUpperCase()
    let shapeColor = this.props.target.get('shapeColor')

    if (shapeColor == 'white') {
      shapeColor = '#FFF8DC'
    }

    return (
      <>
        <div
          className="mask"
          style={{
            maskImage: `url("/img/thumbnails/${shape}.png")`,
            WebkitMaskImage: `url("/img/thumbnails/${shape}.png")`,
            backgroundColor: shapeColor,
          }}
        >
          <div style={{ color: alphaColor }}>
            <svg
              style={{ width: '100px', height: '100px' }}
              viewBox={'0 0 100 100'}
            >
              <text
                stroke={'black'}
                strokeWidth={1}
                fill={alphaColor}
                style={{
                  fontSize: '50px',
                  textAlign: 'center',
                  textAnchor: 'middle',
                  dominantBaseline: 'central',
                  fontWeight: 'bold',
                }}
                x={50}
                y={50}
              >
                {alpha}
              </text>
            </svg>
          </div>
        </div>
      </>
    )
  }

  renderEmergentClassificationFields() {
    return (
      <TargetEmergentFields
        description={this.state.description}
        getHandler={this.getHandler}
      />
    )
  }

  renderGeotagFieldsIfApplicable() {
    if (
      this.props.target.get('type') != 'emergent' &&
      this.props.target.get('offaxis')
    ) {
      return <div className="hidden" />
    }

    if (this.props.target.get('type') == 'emergent') {
      return <div className="hidden" />
    }

    return (
      // <div className="row">
      //   <TargetGeotagFields
      //     latitude={'' + this.state.latitude}
      //     longitude={'' + this.state.longitude}
      //     getHandler={this.getHandler}
      //   />
      // </div>
      <div className="row">
        <p>
          {this.state.shapeColor} {this.state.shape} <br />
          {this.state.alphaColor} {this.state.alpha}
        </p>
        <>
          Latitude: {this.state.latitude}
          <br />
          Longitude: {this.state.longitude}
        </>
      </div>
    )
  }

  renderButtons() {
    const t = this.props.target
    return (
      <div>
        <TargetButtonRow
          type={t.get('type')}
          offaxis={t.get('offaxis')}
          isSaved={t.has('id')}
          saveable={this.canSave()}
          save={this.save}
          deletable={this.canDelete()}
          deleteFn={this.delete}
          send={this.sendToAutopilot}
        />
      </div>
    )
  }

  renderSightingPreviewRow() {
    // toJSON is a shallow conversion (preserving immutable html attributes), while toJS would be deep
    const sightingPreviews = this.props.sightings
      .map(this.renderSightingPreview)
      .toJSON()
    return <div className="sighting-images">{sightingPreviews}</div>
  }

  renderSightingPreview(sighting) {
    return (
      <MergeSightingPreview
        key={this.getSightingPreviewKey(sighting)}
        onClick={() => this.selectSightingAsThumbnail(sighting)}
        isThumbnail={sighting.get('id') === this.state.thumbnailTsid}
        isMerged={true}
        sighting={sighting}
        onDragStart={
          this.isTargetTypeSpecial()
            ? undefined
            : () => this.props.onTsDragStart(sighting)
        }
        onDragEnd={
          this.isTargetTypeSpecial() ? undefined : this.props.onTsDragEnd
        }
        dragging={this.isSightingBeingDragged(sighting)}
      />
    )
  }

  getSightingPreviewKey(sighting) {
    return sighting.get('id') + '-image-' + sighting.get('type')
  }

  isSightingBeingDragged(sighting) {
    return (
      sighting.get('type') === 'alphanum' &&
      sighting.get('id') === this.props.dragId
    )
  }

  isTargetTypeSpecial() {
    const t = this.props.target
    return t.get('type') === 'emergent' || t.get('offaxis') || !t.has('id')
  }

  //sends geolocation to autopilot
  sendToAutopilot(e) {
    e.preventDefault()
    this.props.sendTarget(this.props.target)
  }

  save() {
    const s = this.state
    const t = this.props.target

    if (this.canSave(true)) {
      const nonGeotagAttributeNames = this.getNonGeotagMutableAttributeNames()

      let updatedVals = fromJS(_.pick(s, nonGeotagAttributeNames)).filter(
        (value, key) => t.get(key) !== value
      )

      if (this.isValidGeotagModified()) {
        updatedVals = updatedVals.set(
          'geotag',
          fromJS({
            gpsLocation: {
              longitude: s.longitude,
              latitude: s.latitude,
            },
          })
        )
      }

      //if has an id, that means it exists in the database => update the values
      if (t.has('id')) {
        this.props.updateTarget(t, updatedVals)
      } else {
        this.props.saveTarget(t.merge(updatedVals), fromJS([]))
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

  canDelete(showReason) {
    if (this.props.target.has('pending')) {
      if (showReason) {
        SnackbarUtil.render('Cannot delete target: target is currently saving')
      }
      return false
    }

    return true
  }

  canSave(showReason) {
    return (
      this.areAllFieldsValidToSave(showReason) &&
      this.isAnyFieldModifiedToSave(showReason)
    )
  }

  areAllFieldsValidToSave(showReason) {
    return this.isTargetNotCurrentlySavingToSave(showReason)
    // this.areClassificationFieldsValidToSave(showReason) &&
    // this.isGeotagValidAndSaneToSave(showReason)
  }

  isTargetNotCurrentlySavingToSave(showReason) {
    if (this.props.target.has('pending')) {
      if (showReason)
        SnackbarUtil.render('Cannot save target: target is currently saving')
      return false
    }
    return true
  }

  areClassificationFieldsValidToSave(showReason) {
    const s = this.state

    if (this.props.target.get('type') === 'alphanum') {
      if (!s.shape) {
        if (showReason)
          SnackbarUtil.render('Cannot save target: shape field is not set')
        return false
      }
      if (!s.shapeColor) {
        if (showReason)
          SnackbarUtil.render(
            'Cannot save target: shape color field is not set'
          )
        return false
      }
      if (!s.alpha) {
        if (showReason)
          SnackbarUtil.render('Cannot save target: alpha field is empty')
        return false
      }
      if (!s.alphaColor) {
        if (showReason)
          SnackbarUtil.render(
            'Cannot save target: alpha color field is not set'
          )
        return false
      }
      return true
    } else if (this.props.target.get('type') === 'emergent') {
      if (s.description.length == 0) {
        if (showReason)
          SnackbarUtil.render('Cannot save target: description is empty')
        return false
      }
      return true
    }

    SnackbarUtil.render(
      'ERROR: target not alphanum or emergent, fields not valid to save (please tell someone on Platform this)'
    )
    return false
  }

  isGeotagValidAndSaneToSave(showReason) {
    if (this.state.latitude === '' && this.state.longitude === '') {
      return true
    }

    if (!this.isNonEmptyGeotagValidToSave(showReason)) {
      return false
    }
    if (!this.isValidNonEmptyGeotagInSaneLocationToSave(showReason)) {
      return false
    }

    return true
  }

  isNonEmptyGeotagValidToSave(showReason) {
    const s = this.state

    if (s.latitude === '' || s.longitude === '') {
      if (showReason)
        SnackbarUtil.render(
          'Cannot save target: only one lat/long field is set (both can be empty)'
        )
      return false
    }
    if (_.isNaN(parseFloat(s.latitude))) {
      if (showReason)
        SnackbarUtil.render('Cannot save target: latitude is not a number')
      return false
    }
    if (_.isNaN(parseFloat(s.longitude))) {
      if (showReason)
        SnackbarUtil.render('Cannot save target: longitude is not a number')
      return false
    }

    return true
  }

  // this checks that geotag is within 0.5 degrees of latitude and longitude from Neno or PAX
  // that's about 25-35 miles -- this is used as a sanity check, not a guarantee within bounds
  isValidNonEmptyGeotagInSaneLocationToSave(showReason) {
    const lat = parseFloat(this.state.latitude)
    const lon = parseFloat(this.state.longitude)

    const isGeotagNearPAX =
      Math.abs(lat - PAX_COORDS[0]) < 0.5 &&
      Math.abs(lon - PAX_COORDS[1]) < 0.5
    const isGeotagNearNeno =
      Math.abs(lat - NENO_COORDS[0]) < 0.5 &&
      Math.abs(lon - NENO_COORDS[1]) < 0.5
    if (!isGeotagNearPAX && !isGeotagNearNeno) {
      if (showReason) {
        SnackbarUtil.render(
          'Cannot save target: geotag not near PAX (lat: ' +
            PAX_COORDS[0] +
            ', long: ' +
            PAX_COORDS[1] +
            ') or Neno (lat: ' +
            NENO_COORDS[0] +
            ', long: ' +
            NENO_COORDS[1] +
            ')'
        )
      }
      return false
    }

    return true
  }

  // assumes all fields (specifically geotag) are valid
  isAnyFieldModifiedToSave(showReason) {
    const isAnyFieldModifiedToSave = true
    // this.isAnyNonGeotagAttributeModified() || this.isValidGeotagModified()

    if (!isAnyFieldModifiedToSave && showReason) {
      if (this.props.target.get('type') === 'alphanum') {
        SnackbarUtil.render(
          'Cannot save target: no field/thumbnail/geotag changes to save'
        )
      } else if (this.props.target.get('type') === 'emergent') {
        SnackbarUtil.render(
          'Cannot save target: no description/thumbnail/geotag changes to save'
        )
      }
    }

    return isAnyFieldModifiedToSave
  }

  isAnyNonGeotagAttributeModified() {
    const fieldsToCompare = this.getNonGeotagMutableAttributeNames()

    const currentFieldsToCompare = _.pick(this.state, fieldsToCompare)
    const savedFieldsToCompare = _.pick(
      this.props.target.toJS(),
      fieldsToCompare
    )

    return !_.isEqual(currentFieldsToCompare, savedFieldsToCompare)
  }

  isValidGeotagModified() {
    if (this.state.latitude === '' || this.state.longitude === '') {
      return false
    }

    const savedTargetLatitude = this.props.target.getIn(
      ['geotag', 'gpsLocation', 'latitude'],
      undefined
    )
    const savedTargetLongitude = this.props.target.getIn(
      ['geotag', 'gpsLocation', 'longitude'],
      undefined
    )
    return (
      savedTargetLatitude !== this.state.latitude ||
      savedTargetLongitude !== this.state.longitude
    )
  }

  getHandler(prop) {
    return (e) => {
      let val = e.target.value
      if (prop === 'alpha') {
        val = val.slice(0, 1).toUpperCase()
      }
      this.setState({ [prop]: val })
    }
  }

  dragEnter(e) {
    this.setState({
      dragCtr: this.state.dragCtr + 1,
    })
  }

  dragLeave(e) {
    this.setState({
      dragCtr: this.state.dragCtr - 1,
    })
  }

  drop(e) {
    this.setState({
      dragCtr: 0,
    })
    this.props.onTsDrop(this.props.target)
  }

  selectSightingAsThumbnail(sighting) {
    this.setState({ thumbnailTsid: sighting.get('id') })
    this.save()
  }

  getNonGeotagMutableAttributeNames() {
    const sharedAttributes = ['thumbnailTsid']
    const alphanumAttributes = ['shape', 'shapeColor', 'alpha', 'alphaColor']
    const emergentAttributes = ['description']

    let typeAttributes
    if (this.props.target.get('type') === 'alphanum') {
      typeAttributes = alphanumAttributes
    } else if (this.props.target.get('type') === 'emergent') {
      typeAttributes = emergentAttributes
    }

    return _.concat(typeAttributes, sharedAttributes)
  }
}

MergeTarget.propTypes = {
  target: ImmutablePropTypes.map.isRequired,
  sightings: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired, //all sightings bound to the target
  onTsDragStart: PropTypes.func.isRequired,
  onTsDragEnd: PropTypes.func.isRequired,
  onTsDrop: PropTypes.func.isRequired,
  dragId: PropTypes.number,
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveTarget: TargetOperations.saveTarget(dispatch),
  updateTarget: TargetOperations.updateTarget(dispatch),
  deleteSavedTarget: TargetOperations.deleteSavedTarget(dispatch),
  deleteUnsavedTarget: TargetOperations.deleteUnsavedTarget(dispatch),
  sendTarget: TargetOperations.sendTarget(dispatch),
})

export default connect(null, mapDispatchToProps)(MergeTarget)
