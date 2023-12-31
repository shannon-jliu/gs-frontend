import React from 'react'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { fromJS, List } from 'immutable'
import _ from 'lodash'

import * as config from '../../../util/config'

import Tag, { Tag as TagClass } from '../../../pages/tag/tag'

Enzyme.configure({ adapter: new Adapter() })
const mockStore = configureMockStore()

const sighting = fromJS({
  pixelx: 400,
  pixely: 427,
  width: 141,
  height: 141,
  radiansFromTop: 2.848003666181043,
  localId: '400.3664459161148:427.4889624724062:70.40779243312804:0.5569999826710164',
  assignment: {
    id: 1,
    timestamp: 1543700301659,
    image: {
      id: 1,
      timestamp: 5,
      imageUrl: '/api/v1/image/file/5.jpeg'
    },
    assignee: 'MDLC',
    done: true,
    username: '<NO_USER>'
  }
})

const mappedAssignment = fromJS({
  assignment: {
    assignee: 'MDLC',
    done: false,
    id: 1,
    image: {
      id: 1,
      imageUrl: 'image.png',
      timestamp: 1,
      imgMode: 'tracking'
    }
  },
  currentIndex: 0,
  loading: false,
  total: 1,
})

describe('Basic tests no sightings', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      assignment: mappedAssignment,
      sightings: List(),
      finishAssignment: jest.fn((assignment) => assignment),
      getPrevAssignment: jest.fn((assignment) => assignment),
    }
    wrapper = shallow(<TagClass {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders the imageviewer', () => {
    expect(wrapper.find('ImageViewer').first()).toBeDefined()
  })

  it('will not render any TagSightings if no sightings', () => {
    expect(wrapper.find('TagSighting')).toHaveLength(0)
  })

  it('renders the buttons', () => {
    expect(wrapper.find('button')).toHaveLength(2)
  })

  it('calls onNext and next button is not disabled', () => {
    const nextButton = wrapper.find('button').at(1)
    nextButton.simulate('click')
    expect(props.finishAssignment).toHaveBeenCalledTimes(1)
    expect(nextButton.hasClass('disabled')).toBe(false)
  })

  it('calls onPrev and prev button is disabled', () => {
    const prevButton = wrapper.find('button').first()
    prevButton.simulate('click')
    expect(props.getPrevAssignment).toHaveBeenCalledTimes(1)
    expect(prevButton.hasClass('disabled')).toBe(true)
  })
})

describe('Basic tests with sightings', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      assignment: mappedAssignment.set('loading', true).set('currentIndex', 1),
      sightings: fromJS([sighting])
    }
    wrapper = shallow(<TagClass {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders the TagSighting', () => {
    expect(wrapper.find('Connect(TagSighting)')).toHaveLength(1)
    expect(wrapper.find('.name').text().includes('TARGET')).toBe(true)
  })

  it('ensures prev button is not disabled', () => {
    const prevButton = wrapper.find('button').first()
    expect(prevButton.hasClass('disabled')).toBe(false)
  })

  it('ensures next button is disabled', () => {
    const nextButton = wrapper.find('button').at(1)
    expect(nextButton.hasClass('disabled')).toBe(true)
  })
})

describe('Basic tests with ROI images', () => {
  let wrapper
  const props = {
    assignment: mappedAssignment.set('loading', true)
      .set('currentIndex', 1)
      .setIn(['assignment', 'image', 'imgMode'], 'fixed'),
    sightings: fromJS([sighting])
  }

  it('renders the TagSighting with ROI label', () => {
    // need to manually set TWO_PASS_MODE here since default is false
    config.TWO_PASS_MODE = true
    wrapper = shallow(<TagClass {...props} />)
    expect(wrapper.find('Connect(TagSighting)')).toHaveLength(1)
    expect(wrapper.find('.name').text().includes('ROI')).toBe(true)
  })

  it('renders the TagSighting with Target label if TWO_PASS_MODE false', () => {
    config.TWO_PASS_MODE = false
    wrapper = shallow(<TagClass {...props} />)
    expect(wrapper.find('Connect(TagSighting)')).toHaveLength(1)
    expect(wrapper.find('.name').text().includes('TARGET')).toBe(true)
  })
})

describe('Image manipulation tests', () => {
  let wrapper, instance
  beforeEach(() => {
    const props = {
      assignment: mappedAssignment.set('loading', true).set('currentIndex', 1),
      sightings: fromJS([sighting])
    }
    wrapper = shallow(<TagClass {...props} />)
    instance = wrapper.instance()
  })

  it('renders the imagetools component', () => {
    const sliders = wrapper.find('ImageTools')
    expect(sliders).toHaveLength(1)
  })

  it('resets the image manipulation state correctly', () => {
    instance.state = {
      brightness: 101,
      contrast: 50,
      saturation: 123,
    }
    instance.reset()
    expect(instance.state.brightness).toBe(100)
    expect(instance.state.contrast).toBe(100)
    expect(instance.state.saturation).toBe(100)
  })

  it('runs gethandler properly', () => {
    const e = { target: { value: 120 } }
    instance.getHandler('brightness')(e)
    expect(instance.state.brightness).toBe(120)
  })
})

describe('mapStateToProps', () => {
  const firstAssignment = fromJS({
    id: 1,
    timestamp: 1543700301659,
    image: {
      id: 1,
      timestamp: 5,
      imageUrl: 'image.png',
    },
    assignee: 'MDLC',
    done: true,
    username: '<NO_USER>'
  })

  const assignmentReducer = fromJS({
    assignments: [
      firstAssignment,
      {
        id: 2,
        timestamp: 1548532673627,
        image: {
          id: 2,
          timestamp: 6,
          imageUrl: 'image2.png',
        },
        assignee: 'MDLC',
        done: true,
        username: '<NO_USER>'
      }],
    current: 0,
    loading: false
  })

  const sightingsReducer = fromJS({
    local: [sighting],
    saved: []
  })

  let props, wrapper, instance
  beforeEach(() => {
    const store = mockStore({
      assignmentReducer: assignmentReducer,
      targetSightingReducer: sightingsReducer
    })
    wrapper = shallow(<Tag store={store}/>)
    instance = wrapper.instance()
  })

  it('initializes the assignment props correctly', () => {
    const assignmentProp = wrapper.props().children.props.assignment
    expect(assignmentProp.get('total')).toEqual(2)
    expect(assignmentProp.get('loading')).toEqual(false)
    expect(assignmentProp.get('assignment')).toEqual(firstAssignment)
    expect(assignmentProp.get('currentIndex')).toEqual(0)
  })

  it('initializes the sightings props correctly', () => {
    const sightingsProp = wrapper.props().children.props.sightings
    expect(sightingsProp.size).toEqual(1)
    expect(sightingsProp.first().get('pixelx')).toEqual(400)
    expect(sightingsProp.first().get('assignment').get('id')).toEqual(1)
  })
})
