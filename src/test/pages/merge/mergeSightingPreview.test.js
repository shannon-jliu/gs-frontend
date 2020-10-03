import React from 'react'
import renderer from 'react-test-renderer'
import { fromJS } from 'immutable'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import MergeSightingPreview from '../../../pages/merge/mergeSightingPreview.js'
import { GROUND_SERVER_URL } from '../../../constants/links'

Enzyme.configure({ adapter: new Adapter() })

describe('MergeSightingPreview', () => {
  const props = {
    sighting: fromJS({
      type: 'alphanum',
      shapeColor: 'red',
      shape:'square',
      alpha: 'T',
      alphaColor: 'blue',
      mdlcClassConf: 'low',
      offaxis: false,
      localId: '979.6291390728477:526.5298013245033:702.620099040495:0.0006300101418243997',
      pixelx: 980,
      pixely: 527,
      radiansFromTop: 2.5051419954498755,
      width: 20,
      assignment: {
        image: {
          imageUrl: '/cuair_default.png'
        }
      }
    }),
    dragging: false,
    isMerged: false,
    isThumbnail: false,
  }

  it('renders correctly', () => {
    const wrapper = shallow(<MergeSightingPreview {...props} />)
    expect(wrapper).toBeDefined()
  })

  it('has false draggable when onDragStart is undefined', () => {
    const wrapper = shallow(<MergeSightingPreview {...props} />)

    expect(wrapper.find('div').prop('draggable')).toEqual(false)
  })

  it('gets style', () => {
    const wrapper = shallow(<MergeSightingPreview {...props} />)
    const instance = wrapper.instance()

    expect(instance.getStyle(1080, 1800).backgroundImage).toEqual('url(' + GROUND_SERVER_URL + '/cuair_default.png)')
    expect(instance.getStyle(1080, 1800).backgroundSize).toEqual('5400px 9000px')
    expect(instance.getStyle(1080, 1800).backgroundPosition).toEqual('-4850px -2585px')
    expect(instance.getStyle(1080, 1800).opacity).toBeUndefined()
  })

  it('gets style when dragging', () => {
    const newProps = {
      sighting: props.sighting,
      isMerged: props.isMerged,
      isThumbnail: props.isThumbnail,
      dragging: true
    }
    const wrapper = shallow(<MergeSightingPreview {...newProps} />)
    const instance = wrapper.instance()

    expect(instance.getStyle(1080, 1800).backgroundImage).toEqual('url(' + GROUND_SERVER_URL + '/cuair_default.png)')
    expect(instance.getStyle(1080, 1800).backgroundSize).toEqual('5400px 9000px')
    expect(instance.getStyle(1080, 1800).backgroundPosition).toEqual('-4850px -2585px')
    expect(instance.getStyle(1080, 1800).opacity).toEqual(0.15)
  })
})
