import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import M from 'materialize-css'

import PlaneSystemOperations from '../../operations/planeSystemOperations'

import { PLANE_SERVER_URL } from '../../constants/links'

import './planeSystem.css'

export class PlaneSystem extends Component {
  constructor(props){
    super(props)
    this.state = {
      imgSrc: null
    }

    this.getBase64Image = this.getBase64Image.bind(this)
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

  componentDidMount() {
    window.addEventListener('load', () => {
      let loadImages = () => {
        this.props.getImage()
        var i = new Image()

        // To avoid "tained canvas"/CORS issue
        i.crossOrigin = 'Anonymous'

        var classThis = this
        i.onload = function() {
          var imgData = classThis.getBase64Image(i)
          classThis.setState({
            imgSrc: 'data:image;base64,' + imgData
          })
        }
        i.src = PLANE_SERVER_URL + '/api/test'

        setTimeout(loadImages, 500)
      }
      loadImages()
    })
  }

  componentDidUpdate(prevProps) {
    M.updateTextFields()
  }

  render() {
    return (
      <div className='container'>
        <img className='image' src={this.state.imgSrc}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  planeSystemState: state.planeSystemReducer
})

const mapDispatchToProps = (dispatch) => ({
  getImage: PlaneSystemOperations.getImage(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PlaneSystem)
