import PropTypes from 'prop-types'
import React, { Component } from 'react'
import $ from 'jquery'



class ShapeTagger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // points: [],
      globalX: -1,
      globalY: -1,
      firstX: -1,
      firstY: -1,
      mx: -1,
      my: -1,
      completed: false,
      mouseNearStart: false
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onDeleteHover = this.onDeleteHover.bind(this)
    this.onDeleteUnhover = this.onDeleteUnhover.bind(this)
  }


  onMouseDown(event) {
    /* save the location where the mouse was clicked (the center)
      if the image is zoomed, you can "drag" the image around */
    let p = this.props.points
    let lastP = p[p.length - 1]
    if (!this.props.completed) {
      if (this.state.mouseNearStart) {
        this.props.setCompleted(true)
      }
      else if (!(p.length && lastP.x == this.state.mx && lastP.y == this.state.my)) {
        if (!p.length) {
          this.setState({ firstX: this.state.globalX, firstY: this.state.globalY })
        }
        let imgscale = this.props.heightWidth / this.props.sighting.get('width')
        let nx = Math.round(this.props.sighting.get('pixelx') + (this.state.mx - this.props.heightWidth/2) / imgscale)
        let ny = Math.round(this.props.sighting.get('pixely') + (this.state.my - this.props.heightWidth/2) / imgscale)
        this.props.setPoints(
          [...this.props.points, { x: nx, y: ny }]
        )
      }
    }
  }


  onMouseMove(event) {

    var shapetagger = document.getElementById('shapetagger')
    var rect = shapetagger.getBoundingClientRect();
    let newMX = event.clientX
    // TODO: idk why the y coordinate is off by 10, should find a fix
    let newMY = event.clientY - rect.top + document.documentElement.scrollTop + 10

    const localX = event.clientX - event.target.offsetLeft;

    const localY = event.clientY - rect.top - event.target.offsetTop + 10;

    this.setState({
      mx: localX,
      my: localY,
      globalX: newMX,
      globalY: newMY
    })


    if (this.state.firstX) {
      let dx = this.state.firstX - newMX
      let dy = this.state.firstY - newMY

      this.setState({ mouseNearStart: Math.sqrt(dx * dx + dy * dy) < 15 })
    }

  }

  onDelete() {
    this.setState({ firstX: false, firstY: false })
    this.props.setCompleted(false)
    this.props.setPoints([])
  }

  onDeleteHover() {
    this.setState({ hoverDelete: true })
  }

  onDeleteUnhover() {
    this.setState({ hoverDelete: false })
  }

  render() {
    const imgscale = this.props.heightWidth / this.props.sighting.get('width')
    const bgSize = this.props.imgWidth * imgscale + 'px ' + this.props.imgHeight * imgscale + 'px'
    /* The following calculations for x and y are calculating the offset of the fully-sized/uncompressed image that
      will be displayed as the background image for the actual image sighting. The 315/2 is dealing with moving
      the background image relative to the center of the image sighting, which is 315px by 315px. */
    let x = this.props.heightWidth / 2 - this.props.sighting.get('pixelx') * imgscale
    let y = this.props.heightWidth / 2 - this.props.sighting.get('pixely') * imgscale
    let points = <div style={{ position: 'relative' }}>
      {this.props.points.map((point, index) =>
        <div key={index + 'point'} className="dot" style={{
          left: Math.round((point.x - this.props.sighting.get('pixelx')) * imgscale + this.props.heightWidth / 2),
          top: Math.round((point.y - this.props.sighting.get('pixely')) * imgscale + this.props.heightWidth / 2),
          // Shape tagging completed
          ...(this.props.completed && { border: '4px solid lime' }),
          // Shape tagging not completed: only first point is green
          ...(!this.props.completed && index === 0 && { border: (this.state.mouseNearStart ? '6px' : '4px') + ' solid lime' })
        }} />
      )}
    </div>

    // First point style
    return (
      <div
        className='image'
        ref="shapetagger"
        id='shapetagger'
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        style={{
          backgroundImage: 'url(' + this.props.imageUrl + ')',
          backgroundSize: bgSize,
          backgroundPosition: x + 'px ' + y + 'px',
          backgroundRepeat: 'no-repeat',
          width: '315px',
          height: '315px'

        }}
      >
        {points}
        < i className={'material-icons ' + (this.state.hoverDelete ? 'red-text text-lighten-1' : 'white-text')}
          onClick={this.onDelete}
          onMouseEnter={this.onDeleteHover}
          onMouseLeave={this.onDeleteUnhover}
          style={{
            cursor: 'pointer', float: 'right', margin: '0.5rem'
          }}
        > delete</i >
      </div >
    )


  }
}

ShapeTagger.propTypes = {
  heightWidth: PropTypes.number.isRequired,
  imgWidth: PropTypes.number.isRequired,
  imgHeight: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  sighting: PropTypes.object.isRequired,
  points: PropTypes.array.isRequired,
  setPoints: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  setCompleted: PropTypes.func.isRequired
}

export default ShapeTagger