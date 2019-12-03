import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import _ from 'lodash'

import ImageViewer from '../../components/imageViewer.js'
import DEFAULT_IMG from '../../img/cuair_default.png'

Enzyme.configure({ adapter: new Adapter() })

let imageViewer, imgViewerInstance

beforeEach(() => {
  imageViewer = mount(<ImageViewer onTag={() => false}/>)
  imgViewerInstance = imageViewer.instance()
  imgViewerInstance.setState({
    img: {
      width: 4912,
      height: 3684
    },
    width: 1427,
    height: 906
  })
})

it('renders properly', () => {
  expect(imageViewer).toBeDefined()
})

describe('componentDidMount', () => {
  it('calls resize and loads the default image', () => {
    const resizeMock = jest.fn()
    imgViewerInstance.resize = resizeMock

    const loadImageMock = jest.fn()
    imgViewerInstance.loadImage = loadImageMock

    imageViewer.update()
    imgViewerInstance.componentDidMount()
    expect(resizeMock).toHaveBeenCalled()
    expect(loadImageMock).toHaveBeenCalledWith(DEFAULT_IMG)
  })
})

describe('onMouseMove', () => {
  // don't have to worry about outside image viewer since they cannot click
  // outside the bounds
  const event = {
    clientX: 100,
    clientY: 100
  }
  it('should track the mouse movement', () => {
    imgViewerInstance.onMouseMove(event)
    expect(imgViewerInstance.state.mx).toEqual(100)
    expect(imgViewerInstance.state.my).toEqual(100)
  })

  it('should account for vertical scrolling', () => {
    document.documentElement.scrollTop = 50

    imgViewerInstance.onMouseMove(event)
    expect(imgViewerInstance.state.mx).toEqual(100)
    expect(imgViewerInstance.state.my).toEqual(150)
  })

  it('should drag the image if in dragging mode', () => {
    const event = {
      clientX: 100,
      clientY: 100
    }
    imgViewerInstance.setState({
      dragging: true,
      view: {
        scale: 2,
        x: 50,
        y: 50
      }
    })
    imgViewerInstance.onMouseMove(event)
  })
})


describe('onMouseDown', () => {
  it('should set the proper values', () => {
    imgViewerInstance.setState({ mx: 100, my: 200 })
    imgViewerInstance.onMouseDown()
    expect(imgViewerInstance.state.dragging).toEqual(true)
    expect(imgViewerInstance.state.mousedown.x).toEqual(100)
    expect(imgViewerInstance.state.mousedown.y).toEqual(200)
  })
})

describe('onMouseUp', () => {
  it('should set the proper values', () => {
    imgViewerInstance.setState({ mx: 100, my: 200 })
    imgViewerInstance.onMouseUp()
    expect(imgViewerInstance.state.dragging).toEqual(false)
    expect(imgViewerInstance.state.mousedown.x).toEqual(-1)
    expect(imgViewerInstance.state.mousedown.y).toEqual(-1)
  })

  it('should detect if it is a click', () => {
    imgViewerInstance.setState({ mx: 100, my: 200 })
    imgViewerInstance.onMouseUp()

    const onClickMock = jest.fn()
    imgViewerInstance.onClick = onClickMock

    // simulate a click
    imgViewerInstance.onMouseDown()
    imgViewerInstance.onMouseUp()

    expect(imgViewerInstance.state.dragging).toEqual(false)
    expect(imgViewerInstance.state.mousedown.x).toEqual(-1)
    expect(imgViewerInstance.state.mousedown.y).toEqual(-1)
    expect(onClickMock).toHaveBeenCalled()
  })
})

describe('onWheel', () => {
  it('changes the scale of the image', () => {
    const eventMock = {}
    eventMock.stopPropagation = jest.fn()
    eventMock.preventDefault = jest.fn()
    eventMock.deltaY = -1
    imgViewerInstance.onWheel(eventMock)
    expect(imgViewerInstance.state.view.scale).toEqual(1.001)
  })
})

describe('pointOnImage', () => {
  it('properly calculates the pixel location', () => {
    const ptOnImage = imgViewerInstance.pointOnImage(500, 100)
    expect(Math.round(ptOnImage.x)).toEqual(1588)
    expect(Math.round(ptOnImage.y)).toEqual(407)
  })
})

describe('onClick', () => {
  it('is a noop if it is not taggable', () => {
    const stateBefore = imgViewerInstance.state
    imgViewerInstance.onClick()
    expect(imgViewerInstance.state).toEqual(stateBefore)
  })

  it('turns tag on and sets the center of circle if taggable', () => {
    imageViewer = mount(<ImageViewer taggable={true} onTag={() => false} />)
    imgViewerInstance = imageViewer.instance()
    imgViewerInstance.setState({
      img: {
        width: 4912,
        height: 3684
      },
      width: 1427,
      height: 906,
      mx: 500,
      my: 100
    })
    imgViewerInstance.onClick()
    expect(imgViewerInstance.state.tag.on).toEqual(true)
    expect(imgViewerInstance.state.tag.cx).toBeGreaterThan(0)
    expect(imgViewerInstance.state.tag.cy).toBeGreaterThan(0)
  })

  // state used when selecting w/ red circle thingy
  const taggingState = {
    img: {
      width: 4912,
      height: 3684
    },
    width: 1427,
    height: 906,
    mx: 600, // mock the mouse moving 100 pixels down and to the right
    my: 200,
    tag: { // set current state to already have been tagging
      on: true,
      cx: 1587.860927152318, // this is the result of the above test
      cy: 406.6225165562914
    }
  }

  it('if taggable and tag on, set the target sighting', () => {
    let returnObj = {}
    const onTagMock = jest.fn(tagObj => returnObj = tagObj)
    imageViewer = mount(<ImageViewer taggable={true} onTag={onTagMock}/>)
    imgViewerInstance = imageViewer.instance()
    imgViewerInstance.setState(taggingState)
    imgViewerInstance.onClick()
    expect(onTagMock).toHaveBeenCalled()
    expect(returnObj.pixelX).toEqual(1588)
    expect(returnObj.pixelY).toEqual(407)
    expect(returnObj.width).toEqual(1150)
    expect(returnObj.height).toEqual(1150)
    expect(returnObj.radiansFromTop).toBeGreaterThan(2.35)
  })

  it('if taggable and tag on, sets orientation properly down', () => {
    let returnObj = {}
    const onTagMock = jest.fn(tagObj => returnObj = tagObj)
    imageViewer = mount(<ImageViewer taggable={true} onTag={onTagMock}/>)
    imgViewerInstance = imageViewer.instance()

    // simluate only moving down 100 pixels
    const moveDownState = _.assign(taggingState, { mx: 500 })
    imgViewerInstance.setState(moveDownState)
    imgViewerInstance.onClick()
    // since we moved the mouse straight down, should be 180 from top
    expect(returnObj.radiansFromTop).toEqual(Math.PI)
  })

  it('if taggable and tag on, sets orientation properly right', () => {
    let returnObj = {}
    const onTagMock = jest.fn(tagObj => returnObj = tagObj)
    imageViewer = mount(<ImageViewer taggable={true} onTag={onTagMock}/>)
    imgViewerInstance = imageViewer.instance()

    // simluate only moving right 100 pixels
    const moveRightState = _.assign(taggingState, { my: 100 })
    imgViewerInstance.setState(moveRightState)
    imgViewerInstance.onClick()
    // since we moved the mouse straight down, should be 180 from top
    expect(returnObj.radiansFromTop).toEqual(Math.PI/2)
  })

  it('does not turn tag on or set center of center if it is off the image', () => {
    imageViewer = mount(<ImageViewer taggable={true} onTag={() => false}/>)
    imgViewerInstance = imageViewer.instance()
    imgViewerInstance.setState({
      img: {
        width: 4912,
        height: 3684
      },
      width: 1427,
      height: 906,
      mx: 100, // this mouse value will be "off" the image
      my: 100
    })
    const stateBeforeClick = imgViewerInstance.state
    imgViewerInstance.onClick()
    expect(imgViewerInstance.state).toEqual(stateBeforeClick)
  })
})

describe('rendering with image settings', () => {
  beforeEach(() => {
    let props = {
      brightness: 200,
      contrast: 120,
      saturation: 150,
      onTag: jest.fn()
    }
    imageViewer = mount(<ImageViewer {...props}/>)
    imgViewerInstance = imageViewer.instance()
    imgViewerInstance.setState({
      img: {
        width: 4912,
        height: 3684
      },
      width: 1427,
      height: 906
    })
  })

  it('ignores the filter if all undefined', () => {
    imageViewer.setProps({
      brightness: undefined,
      contrast: undefined,
      saturation: undefined
    })

    expect(imageViewer.ref('viewer').style.filter).toBe('')
  })

  it('ignores the filter if at least one is undefined', () => {
    imageViewer.setProps({
      brightness: 100,
      contrast: 100,
      saturation: undefined
    })

    expect(imageViewer.ref('viewer').style.filter).toBe('')
  })

  it('properly renders the filter', () => {
    const filterString = 'brightness(200%) contrast(120%) saturate(150%)'
    expect(imageViewer.ref('viewer').style.filter).toBe(filterString)
  })
})
