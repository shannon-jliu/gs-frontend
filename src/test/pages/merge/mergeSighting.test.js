import React from 'react'
import renderer from 'react-test-renderer'
import { fromJS } from 'immutable'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import MergeSighting from '../../../pages/merge/mergeSighting.js'

Enzyme.configure({ adapter: new Adapter() })

describe('MergeSighting', () => {
  const props = {
    sighting: fromJS({
      type: 'alphanum',
      shapeColor: 'red',
      shape:'square',
      alpha: 't',
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
          imageUrl: '../../../../img/cuair_default.png'
        }
      }
    }),
    dragging: false
  }

  let wrapper
  beforeEach(() => {
    wrapper = shallow(<MergeSighting {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('has correct titles', () => {
    expect(wrapper.find('div').filterWhere(item => { return item.text() == 'Shape Color: Red'})).toHaveLength(1)
    expect(wrapper.find('div').filterWhere(item => { return item.text() == 'Shape: Square'})).toHaveLength(1)
    expect(wrapper.find('div').filterWhere(item => { return item.text() == 'Alpha: t'})).toHaveLength(1)
    expect(wrapper.find('div').filterWhere(item => { return item.text() == 'Alpha Color: Blue'})).toHaveLength(1)
  })

  it('has correct style when not dragging', () => {
    expect(wrapper.find('div').get(0).props.style).toEqual({})
  })

  it('has correct style when dragging', () => {
    const newProps = {
      sighting: props.sighting,
      dragging: true
    }
    wrapper = shallow(<MergeSighting {...newProps} />)
    expect(wrapper.find('div').get(0).props.style).toEqual({'opacity': 0.15})
  })
})
