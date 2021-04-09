import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Parser } from 'json2csv'
import _ from 'lodash'

// see https://www.npmjs.com/package/json2csv#example-fields-option
const mapped_fields = {
  fields:[
    {
      /* this will make the column name empty
         intellisys datasets have an empty column at the start */
      label: () => {},
      value: 'index',
    },
    'alpha',
    {
      label: 'alpha_color',
      value: 'alphaColor',
    },
    {
      label: 'radians_from_top',
      value: 'radiansFromTop',
    },
    'shape',
    {
      label: 'shape_color',
      value: 'shapeColor',
    },
    {
      label: 'confidence',
      value: 'mdlcClassConf',
    },
    'image_name',
    {
      label: 'sighting_id',
      value: 'id',
    },
    {
      label: 'lon',
      value: 'geotag.gpsLocation.longitude',
    },
    {
      label: 'lat',
      value: 'geotag.gpsLocation.latitude',
    },
    {
      label: 'top_left',
      value: row => [row.pixelX - row.width / 2, row.pixelY - row.width / 2],
    },
    {
      label: 'bottom_right',
      value: row => [row.pixelX + row.width / 2, row.pixelY + row.height / 2],
    },
    'dataset_name',
    'camera_name'
  ]
}

export class CSVDownload extends Component {
  constructor(props) {
    super(props)
    this.parser = new Parser(mapped_fields)

    this.addMetadata = this.addMetadata.bind(this)
    this.parseSightings = this.parseSightings.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.buildDatasetName = this.buildDatasetName.bind(this)
  }

  buildDatasetName() {
    let d = new Date()
    // left pad 0s
    let day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
    let month = (d.getMonth() + 1) < 10 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1)
    // returns the current date as YYYY_MM_DD
    return `${d.getFullYear()}_${month}_${day}`
  }

  addMetadata(ts, index, datasetName) {
    let row = ts

    let imageName = ts.assignment.image.imageUrl
    imageName = imageName.substring(
      imageName.lastIndexOf('/') + 1,
      imageName.length
    )

    // extra metadata that the intellisys metadata
    _.merge(
      row,
      {
        'image_name': imageName,
        'dataset_name': datasetName,
        'camera_name': 'sony',
        'index': index
      }
    )

    return row
  }

  parseSightings(sightings, datasetName) {
    // parses the current reducer to a CSV object
    let metadataSightings = _.map(sightings.toJS(), (obj, i) => this.addMetadata(obj, i, datasetName))
    return this.parser.parse(metadataSightings)
  }

  handleDownload(e) {
    e.preventDefault()
    const a = document.createElement('a')

    const datasetName = this.buildDatasetName()
    const csv = this.parseSightings(this.props.sightings, datasetName)

    const file = new Blob([csv], {type: 'text/csv'})
    a.href = URL.createObjectURL(file)
    a.download = datasetName
    a.click()
  }

  render() {
    return (
      <a className='button' href='' onClick={this.handleDownload}>
        <i className='material-icons'>file_download</i>
      </a>
    )
  }
}

const getSavedTargetSightings = ts => {
  return ts.get('saved')
}

const mapStateToProps = (state) => ({
  sightings: getSavedTargetSightings(state.targetSightingReducer)
})

export default connect(mapStateToProps, null)(CSVDownload)
