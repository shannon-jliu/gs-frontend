import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { ImageSighting } from '../tag/components'
import $ from 'jquery'
import PropTypes from 'prop-types'
import CanvasDraw from 'react-canvas-draw'



import { AUTH_TOKEN_ID } from '../../constants/constants.js'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import './segmenter.css'


class SegmenterTool extends Component {

  constructor(props) {
    super(props)
    this.state = {
      image: null,
      isDown: false,
      previousPointX: '',
      previousPointY: '',
      sighting_topleft_x: -1,
      sighting_topleft_y: -1,
      width_height: 800
    }

    this.loadImage = this.loadImage.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.canvasRef = React.createRef()
    // this.getStyle = this.getStyle.bind(this)

  }

    handleCanvasChange = (e) => {
      let point = e.catenary.p1

      let coord = this.state.coords

      if (coord.p1 == null) {
        coord.p1 = [point.x, point.y]
      } else if (coord.p2 == null) {
        coord.p2 = [point.x, point.y]

        this.setState({
          coords: coord
        })
      }
    }

    loadImage(imageUrl) {
      const canvas = this.canvasRef.current
      var ctx = canvas.getContext('2d')


      let i = new Image()
      i.onload = () => {



        // const imgscale = 100 / this.props.sighting.get('width')
        // const bgWidth = i.width * imgscale
        // const bgHeight = i.height * imgscale
        const pixelx = this.props.sighting.get('pixelx')
        const pixely = this.props.sighting.get('pixely')
        const s_width = this.props.sighting.get('width')
        const s_height = this.props.sighting.get('height')

        const x = pixelx - s_width / 2
        const y = pixely - s_height / 2

        // console.log('sighting ' + this.props.sighting)
        // console.log('x ' + x + ' y ' + y + ' width: ' + i.width + ' height: ' + i.height)
        // console.log('sighting width : ' + this.props.sighting.get('width') + ' sighting height: ' + this.props.sighting.get('width'))
        // ctx.fillRect(0, 0, this.state.width, this.state.height);
        ctx.drawImage(i, x, y, this.props.sighting.get('width'), this.props.sighting.get('height'), 0, 0, this.state.width_height, this.state.width_height)
        // canvas.height = i.width;
        // canvas.width = i.height;

        this.setState({
          image: GROUND_SERVER_URL + imageUrl,
          width: i.width,
          height: i.height,
          sighting_topleft_x: x,
          sighting_topleft_y: y
        })
      }
      i.src = GROUND_SERVER_URL + imageUrl

    }

    // //testWidth and testHeight should only be passed in when testing
    // getStyle(testWidth, testHeight) {
    //     if (testWidth === undefined && this.state.iwidth === -1) {
    //         return {}
    //     }
    //     const imageUrl = this.props.sighting.getIn(['assignment', 'image', 'imageUrl'])
    //     const imgscale = 100 / this.props.sighting.get('width')
    //     const iwidth = testWidth === undefined ? this.state.iwidth : testWidth
    //     const iheight = testHeight === undefined ? this.state.iheight : testHeight
    //     const bgSize = iwidth * imgscale + 'px ' + iheight * imgscale + 'px'
    //     const x = 50 - this.props.sighting.get('pixelx') * imgscale
    //     const y = 50 - this.props.sighting.get('pixely') * imgscale
    //     let style = {
    //         backgroundImage: 'url(' + GROUND_SERVER_URL + imageUrl + ')',
    //         backgroundSize: bgSize,
    //         backgroundPosition: x + 'px ' + y + 'px'
    //     }


    //     return style
    // }

    handleMouseDown(event) { //added code here
      //   console.log(event)
      this.setState({
        isDown: true,
        previousPointX: event.offsetX,
        previousPointY: event.offsetY
      }, () => {
        const canvas = this.canvasRef.current
        var x = event.offsetX
        var y = event.offsetY
        var ctx = canvas.getContext('2d')
        // console.log(x, y)
        ctx.moveTo(x, y)
        ctx.lineTo(x + 1, y + 1)
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, 2 * Math.PI, true)
        ctx.stroke()

        var scaledx = x / this.state.width_height
        var scaledy = y / this.state.width_height

        var realx = scaledx * this.props.sighting.get('width') + this.state.sighting_topleft_x
        var realy = scaledy * this.props.sighting.get('height') + this.state.sighting_topleft_y
      })
    }
    handleMouseMove(event) {

    }
    handleMouseUp(event) {
      this.setState({
        isDown: false
      })
      //if(this.state.isDown){
      const canvas = this.canvasRef.current
      var x = event.offsetX
      var y = event.offsetY
      var ctx = canvas.getContext('2d')

      ctx.moveTo(this.state.previousPointX, this.state.previousPointY)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.closePath()
      //}
    }

    componentDidMount() {
      this.loadImage(this.props.sighting.getIn(['assignment', 'image', 'imageUrl']))
    }

    render() {

      return (

        <div>
          <div>
            <canvas id="canvas" ref={this.canvasRef}
              width={this.state.width_height}
              height={this.state.width_height}
              onMouseDown={
                e => {
                  let nativeEvent = e.nativeEvent
                  this.handleMouseDown(nativeEvent)
                }}
              onMouseMove={
                e => {
                  let nativeEvent = e.nativeEvent
                  this.handleMouseMove(nativeEvent)
                }}
              onMouseUp={
                e => {
                  let nativeEvent = e.nativeEvent
                  this.handleMouseUp(nativeEvent)
                }}
            />
          </div>

          {/* <ImageSighting
                    heightWidth={height_width}
                    imageUrl={this.state.image}
                    imgWidth={this.state.width}
                    imgHeight={this.state.height}
                    sighting={this.props.sighting}
                /> */}

        </div>

      )

      // return (
      //     <div>
      //         <div
      //             className={
      //                 'image' +
      //                 (this.props.isMerged ? ' merged-ts' : '') +
      //                 (this.props.isThumbnail ? ' t-thumb' : '') +
      //                 (this.state.iwidth === -1 || this.state.iheight === -1 ? ' red lighten-3' : '')
      //             }
      //             style={this.getStyle()}>
      //             &nbsp;
      //     </div>
      //     </div>
      // )
    }

}

SegmenterTool.propTypes = {
  sighting: ImmutablePropTypes.map.isRequired,
  // isMerged: PropTypes.bool.isRequired,
  // isThumbnail: PropTypes.bool.isRequired
}

export default SegmenterTool
