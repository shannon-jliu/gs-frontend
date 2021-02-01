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
        /*
         * The first thing you'll need to do is call a function that actually asks the
         * plane system for the image. You don't have to make the function, but you will
         * have to call it here. In fact, the function is made accessible by
         * mapDispatchToProps down at the bottom of the file. This starts to get more into
         * Redux specifics, and I can totally go more in depth if you want! Basically,
         * the function gets tied to this component's "props," which you can access through
         * this.props.THE_PROP_YOU_WANT. (Btw, a "component" is a React
         * term that basically means a chunk of HTML and Javascript code that usually
         * represent a page, or a button, or a checkbox, etc. React is a JavaScript library
         * that makes frontend development easier. One of its main ideas are components.
         * Components are nice because you can compartmentalize and then re-use code you made
         * for a specific UI element, much like how you would put a piece of regular code into
         * a function so that you could easily call that same piece of code in different places.
         * Another cool thing about React is that you can pass data between components. That's
         * actually what a "prop" is: Data passed into a component by a parent component. Redux
         * helps with these props and does some other fancy things to make data management in you
         * app a bit easier.)
         */


        var i = new Image()

        i.crossOrigin = 'Anonymous'

        var classThis = this
        i.onload = function() {
          var imgData = classThis.getBase64Image(i)
          classThis.setState({
            imgSrc: 'data:image;base64,' + imgData
          })
        }

        /*
         * This is a little trick that basically forces the image to be loaded in. Thing is,
         * it has to be loaded in from somewhere, namely the route you made ont the plane server.
         * Much like how you would test the route using Postman, you'll have to complete the URL
         * below with the custom route you made. Once this source for the image is set, we wait
         * in the above "onLoad" function for the image to load in. Once it gets loaded in, we
         * grab the image data and store it in this component's "state." Component state is another
         * React concept and just means the set of data a component keeps track of. For our purposes,
         * that's just the image data.
         */
        i.src = PLANE_SERVER_URL

        setTimeout(loadImages, 500)
      }
      loadImages()
    })
  }

  componentDidUpdate(prevProps) {
    M.updateTextFields()
  }

  render() {
    /*
     * The final step: Actually making the image show up on your screen. All you gotta do
     * is provide the src tag (the "source" for the image) with the correct data. In our case,
     * that's just the data we stored in the state in the "onLoad" function above! So, how do
     * access the state? Much like how we accessed something in the components props, we access
     * something in the component's state by this.state.THE_THING_YOU_WANT.
     */
    return (
      <div className='container'>
        <img className='image' src={''}/>
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
